import { createSign, timingSafeEqual } from 'node:crypto';
import { RECOMMENDATION_LEADERS, QUESTION_KEYS, questions, type Answers } from './recommendations';

type Submission = { id: string; leaderSlug: keyof typeof RECOMMENDATION_LEADERS; name: string; email: string; role: string; sourcePath: string; answers: Answers; recommendation: string; consent: boolean; consentText: string; consentVersion: string };
export type DeliveryJob = { submission_id: string; kind: 'owner_email'|'thank_you'|'sheet'; lease_token: string; submission: Submission; created_at: string; sheet_row: number };
export const SHEET_HEADERS = ['Submission ID','Received at (UTC)','Leader','Contributor','Role / company','Email (private)','Recommendation','Relationship','Specific experience','Impact','Trust / referrals','Publication consent','Consent version','Consent text','Source URL','Initial review status'];
const FROM = 'Cincy Voices <ford@workwithmean.ing>';
const OWNER = 'ford@workwithmean.ing';
const SITE = 'https://voices.workwithmean.ing';
type Env = Record<string,string|undefined>;
class DeliveryError extends Error { constructor(message: string, public hold = false) { super(message); } }
export function authorizedWorker(auth: string|null, secret: string|undefined) {
  if (!secret || secret.length<24 || !auth) return false;
  const a=Buffer.from(auth), b=Buffer.from(`Bearer ${secret}`);
  return a.length===b.length && timingSafeEqual(a,b);
}
export function emailFor(job: DeliveryJob) {
  const s=job.submission, leader=RECOMMENDATION_LEADERS[s.leaderSlug];
  if (job.kind==='thank_you') return { from:FROM,to:s.email,reply_to:OWNER,
    subject:`Thank you for sharing your experience with ${leader}`,
    text:`Hi there,\n\nThanks for taking the time to share your experience with ${leader}. We received your recommendation, and I appreciate you helping others get to know what it's like to work with them.\n\nYour submission is waiting for review and isn't public yet. If we want to make substantive edits, we'll check with you first.\n\nNeed to correct anything or change your publication permission? Just reply to this email.\n\nThanks,\nFord\nWork With Meaning / Cincy Voices\n\nReceipt: ${s.id}` };
  return { from:FROM,to:OWNER,reply_to:s.email,subject:`New recommendation for ${leader}`,
    text:`New recommendation awaiting review\n\nReceipt: ${s.id}\nReceived (UTC): ${job.created_at}\nPerson: ${leader}\nName: ${s.name}\nRole / company: ${s.role}\nEmail: ${s.email}\nSource: ${SITE}${s.sourcePath}\n\nREVIEWED RECOMMENDATION\n${s.recommendation}\n\nORIGINAL RESPONSES\n${questions(leader).map((q,i)=>`${q}\n${s.answers[QUESTION_KEYS[i]]}`).join('\n\n')}\n\nPUBLICATION PERMISSION\nGranted: ${s.consent}\nVersion: ${s.consentVersion}\n${s.consentText}\n\nThis submission has not been published.` };
}
export function sheetRow(job: DeliveryJob) {
  const s=job.submission;
  return [s.id,job.created_at,RECOMMENDATION_LEADERS[s.leaderSlug],s.name,s.role,s.email,s.recommendation,...QUESTION_KEYS.map(k=>s.answers[k]),s.consent,s.consentVersion,s.consentText,`${SITE}${s.sourcePath}`,'pending'];
}
export async function deliveryRpc(name: string, body: object, env: Env = process.env, send: typeof fetch = fetch) {
  if (!env.RECOMMENDATIONS_REST_URL || !env.RECOMMENDATIONS_SERVICE_ROLE_KEY) throw Error('storage_not_configured');
  const r=await send(`${env.RECOMMENDATIONS_REST_URL}/rpc/${name}`,{method:'POST',headers:{'Content-Type':'application/json',apikey:env.RECOMMENDATIONS_SERVICE_ROLE_KEY,Authorization:`Bearer ${env.RECOMMENDATIONS_SERVICE_ROLE_KEY}`},body:JSON.stringify(body),signal:AbortSignal.timeout(12000),cache:'no-store'});
  if (!r.ok) throw Error(`storage_${r.status}`);
  return r.json();
}
async function googleToken(env: Env, send: typeof fetch) {
  if (env.RECOMMENDATIONS_GOOGLE_OAUTH) {
    const account=JSON.parse(env.RECOMMENDATIONS_GOOGLE_OAUTH);
    if (![account.client_id,account.client_secret,account.refresh_token].every(x=>typeof x==='string'&&x.length>0)) throw new DeliveryError('google_invalid_config',true);
    const r=await send('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:account.client_id,client_secret:account.client_secret,refresh_token:account.refresh_token,grant_type:'refresh_token'}),signal:AbortSignal.timeout(10000)});
    if (!r.ok) throw new DeliveryError(`google_auth_${r.status}`,r.status===400||r.status===401||r.status===403);
    const data=await r.json(); if (!data.access_token) throw new DeliveryError('google_token_missing');
    return data.access_token as string;
  }
  if (!env.RECOMMENDATIONS_GOOGLE_SERVICE_ACCOUNT) throw new DeliveryError('google_not_configured',true);
  const account=JSON.parse(env.RECOMMENDATIONS_GOOGLE_SERVICE_ACCOUNT);
  if (typeof account.client_email!=='string'||typeof account.private_key!=='string') throw new DeliveryError('google_invalid_config',true);
  const now=Math.floor(Date.now()/1000), enc=(x: object)=>Buffer.from(JSON.stringify(x)).toString('base64url');
  const input=`${enc({alg:'RS256',typ:'JWT'})}.${enc({iss:account.client_email,scope:'https://www.googleapis.com/auth/spreadsheets',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600})}`;
  const assertion=`${input}.${createSign('RSA-SHA256').update(input).sign(account.private_key,'base64url')}`;
  const r=await send('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion}),signal:AbortSignal.timeout(10000)});
  if (!r.ok) throw new DeliveryError(`google_auth_${r.status}`,r.status===400||r.status===401||r.status===403);
  const data=await r.json(); if (!data.access_token) throw new DeliveryError('google_token_missing');
  return data.access_token as string;
}
export async function deliver(job: DeliveryJob, env: Env=process.env, send: typeof fetch=fetch) {
  if (job.kind!=='sheet') {
    if (!env.RESEND_API_KEY) throw new DeliveryError('email_not_configured',true);
    const r=await send('https://api.resend.com/emails',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${env.RESEND_API_KEY}`,'Idempotency-Key':`cv-recommendation/${job.submission_id}/${job.kind}/v1`},body:JSON.stringify(emailFor(job)),signal:AbortSignal.timeout(12000)});
    if (!r.ok) throw new DeliveryError(`email_${r.status}`,r.status>=400&&r.status<500&&r.status!==429&&r.status!==409);
    const data=await r.json(); if (!data.id) throw new DeliveryError('email_receipt_missing');
    return String(data.id);
  }
  if (!env.RECOMMENDATIONS_SHEET_ID) throw new DeliveryError('sheet_not_configured',true);
  if (!Number.isSafeInteger(job.sheet_row)||job.sheet_row<2) throw new DeliveryError('invalid_sheet_row',true);
  const token=await googleToken(env,send), headers={Authorization:`Bearer ${token}`,'Content-Type':'application/json'};
  const base=`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(env.RECOMMENDATIONS_SHEET_ID)}/values/`;
  const range=`'Submissions'!A${job.sheet_row}:P${job.sheet_row}`;
  const url=base+encodeURIComponent(range);
  const read=await send(url,{headers,signal:AbortSignal.timeout(10000),cache:'no-store'});
  if (!read.ok) throw new DeliveryError(`sheet_read_${read.status}`,read.status===403||read.status===404);
  const old=(await read.json()).values?.[0];
  // Each submission owns a stable row. Fail safely if a manual sort/edit moved it.
  if (old?.some((x:unknown)=>x!==''&&x!==null) && old[0]!==job.submission_id) throw new DeliveryError('sheet_row_conflict',true);
  const r=await send(`${url}?valueInputOption=RAW&includeValuesInResponse=true`,{method:'PUT',headers,body:JSON.stringify({range,majorDimension:'ROWS',values:[sheetRow(job)]}),signal:AbortSignal.timeout(10000)});
  if (!r.ok) throw new DeliveryError(`sheet_write_${r.status}`,r.status===400||r.status===403||r.status===404);
  const result=await r.json();
  if (result.updatedData?.values?.[0]?.[0]!==job.submission_id) throw new DeliveryError('sheet_receipt_mismatch');
  return `${env.RECOMMENDATIONS_SHEET_ID}:${range}`;
}
export async function dispatchRecommendations(id: string|null=null, env: Env=process.env, send: typeof fetch=fetch) {
  if (env.RECOMMENDATIONS_DELIVERY_ENABLED!=='true') return {processed:0};
  const jobs: DeliveryJob[]=await deliveryRpc('cv_claim_recommendation_deliveries',{p_id:id},env,send);
  const results=await Promise.all(jobs.map(async job=>{
    let receipt: string|null=null, error: string|null=null, hold=false;
    try { receipt=await deliver(job,env,send); }
    catch(e) { error=e instanceof DeliveryError?e.message:'provider_unconfirmed'; hold=e instanceof DeliveryError&&e.hold; }
    // If this acknowledgement fails, the lease expires and a retry uses the same provider key/row.
    const recorded=await deliveryRpc('cv_finish_recommendation_delivery',{p_id:job.submission_id,p_kind:job.kind,p_token:job.lease_token,p_receipt:receipt,p_error:error,p_hold:hold},env,send);
    return {kind:job.kind,accepted:Boolean(receipt&&recorded),held:hold};
  }));
  return {processed:jobs.length,results};
}
