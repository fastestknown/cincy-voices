import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID, createHmac } from 'node:crypto';
const base = 'http://127.0.0.1:3188';
const rest = 'http://127.0.0.1:54390';
const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
function token(role) {
  const data = header + '.' + Buffer.from(JSON.stringify({ role, exp: Math.floor(Date.now()/1000)+600 })).toString('base64url');
  return data+'.'+createHmac('sha256','cv-local-test-secret-at-least-thirty-two-characters').update(data).digest('base64url');
}
const auth = { Authorization: 'Bearer '+token('service_role') };
const valid = () => ({ id: randomUUID(), leaderSlug: 'amy-connor', sourcePath: '/leaders/amy-connor', name: 'Synthetic Reviewer', role: 'Test Company', email: `${randomUUID()}@example.com`, consent: true, answers: { relationship: 'This is a synthetic test relationship.', experience: 'A synthetic example of working together.', impact: 'A synthetic outcome for testing the form.', trust: 'Synthetic trust evidence, not a real testimonial.' }, recommendation: 'This is synthetic test content and must never be published as a real endorsement.' });
const post = (data, extra = {}) => fetch(base+'/api/recommendations',{method:'POST',headers:{'Content-Type':'application/json',Origin:base,...extra},body:typeof data==='string'?data:JSON.stringify(data)});
const rpc = async (name,body) => { const r=await fetch(rest+'/rpc/'+name,{method:'POST',headers:{...auth,'Content-Type':'application/json'},body:JSON.stringify(body)});assert.equal(r.status,200,await r.clone().text());return r.json(); };
test('a retried submission atomically queues exactly three delivery jobs',async()=>{
  const s=valid();await post(s);await post(s);
  const jobs=await (await fetch(rest+`/cv_recommendation_deliveries?submission_id=eq.${s.id}`,{headers:auth})).json();
  assert.equal(jobs.length,3);assert.deepEqual(jobs.map(j=>j.kind).sort(),['owner_email','sheet','thank_you']);assert.ok(jobs.every(j=>j.state==='pending'));
});
test('competing workers claim once, stale acknowledgements fail, and accepted work stays accepted',async()=>{
  const s=valid();await post(s);
  const claims=await Promise.all([rpc('cv_claim_recommendation_deliveries',{p_id:s.id}),rpc('cv_claim_recommendation_deliveries',{p_id:s.id})]);
  const jobs=claims.flat();assert.equal(jobs.length,3);assert.equal(new Set(jobs.map(j=>j.kind)).size,3);
  for(const j of jobs){assert.equal(await rpc('cv_finish_recommendation_delivery',{p_id:s.id,p_kind:j.kind,p_token:randomUUID(),p_receipt:'false-receipt'}),false);assert.equal(await rpc('cv_finish_recommendation_delivery',{p_id:s.id,p_kind:j.kind,p_token:j.lease_token,p_receipt:'synthetic-provider-receipt'}),true);}
  assert.deepEqual(await rpc('cv_claim_recommendation_deliveries',{p_id:s.id}),[]);
});
test('expired leases recover; uncertain emails older than provider deduplication window are held',async()=>{
  const s=valid();await post(s);await rpc('cv_claim_recommendation_deliveries',{p_id:s.id});
  const patched=await fetch(rest+`/cv_recommendation_deliveries?submission_id=eq.${s.id}`,{method:'PATCH',headers:{...auth,'Content-Type':'application/json'},body:JSON.stringify({lease_until:'2020-01-01T00:00:00Z',first_attempt_at:'2020-01-01T00:00:00Z'})});assert.ok(patched.ok);
  const jobs=await rpc('cv_claim_recommendation_deliveries',{p_id:s.id});assert.equal(jobs.length,1);assert.equal(jobs[0].kind,'sheet');
  const rows=await (await fetch(rest+`/cv_recommendation_deliveries?submission_id=eq.${s.id}`,{headers:auth})).json();assert.equal(rows.filter(x=>x.state==='needs_review').length,2);
});
test('delivery worker is private',async()=>assert.equal((await fetch(base+'/api/recommendations/deliver')).status,401));
test('rejects cross-origin, malformed, oversized and unconsented submissions', async () => {
  assert.equal((await post(valid(),{Origin:'https://untrusted.example'})).status,403);
  assert.equal((await post('{')).status,400);
  assert.equal((await post('x'.repeat(33000))).status,413);
  assert.equal((await post({...valid(),consent:false})).status,400);
});
test('stores pending consent evidence, deduplicates retries and rejects changed reuse', async () => {
  const data=valid();assert.equal((await post(data)).status,201);assert.equal((await post(data)).status,201);
  assert.equal((await post({...data,recommendation:data.recommendation+' changed'})).status,409);
  const rows=await (await fetch(rest+`/cv_recommendation_submissions?id=eq.${data.id}`,{headers:auth})).json();
  assert.equal(rows.length,1);assert.equal(rows[0].status,'pending');assert.match(rows[0].submission.consentText,/Amy Connor/);assert.equal(rows[0].submission.recommendation,data.recommendation);
});
test('accepts Kevin with correct attribution and enforces durable per-email limit',async()=>{
  const data=valid();data.leaderSlug='kevin-lawson';data.sourcePath='/editorial/kevin-lawson-more-than-a-full-practice';
  for(let i=0;i<3;i++)assert.equal((await post({...data,id:randomUUID()})).status,201);
  assert.equal((await post({...data,id:randomUUID()})).status,429);
});
for(const role of ['anon','authenticated']) {
  test(`${role} cannot read, insert, update, delete or invoke the private inbox`,async()=>{
    const access=await fetch(rest+'/cv_recommendation_deliveries',{headers:{Authorization:'Bearer '+token(role)}});assert.ok([401,403,404].includes(access.status));
    const claim=await fetch(rest+'/rpc/cv_claim_recommendation_deliveries',{method:'POST',headers:{Authorization:'Bearer '+token(role),'Content-Type':'application/json'},body:'{}'});assert.ok([401,403,404].includes(claim.status));
    for(const method of ['GET','POST','PATCH','DELETE']) {
      const r=await fetch(rest+'/cv_recommendation_submissions',{method,headers:{Authorization:'Bearer '+token(role),'Content-Type':'application/json'},...(method==='POST'||method==='PATCH'?{body:'{}'}:{})});
      assert.ok([401,403,404].includes(r.status),`${role} ${method} returned ${r.status}`);
    }
    const r=await fetch(rest+'/rpc/cv_submit_recommendation',{method:'POST',headers:{Authorization:'Bearer '+token(role),'Content-Type':'application/json'},body:JSON.stringify({p_submission:valid()})});
    assert.ok([401,403,404].includes(r.status));
  });
}
