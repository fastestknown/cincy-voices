// Explicit opt-in delivery test. Only sends to Ford, backed by the isolated local test DB.
import {readFile,writeFile} from 'node:fs/promises';
import {randomUUID,createHmac} from 'node:crypto';
import ts from 'typescript';
if(process.env.CV_SEND_TEST_TO_FORD!=='yes')throw Error('Set CV_SEND_TEST_TO_FORD=yes only for an authorized live test.');
process.loadEnvFile('/tmp/cv-recommendation-email-test.env');
const source=(await readFile(new URL('../lib/recommendation-delivery.ts',import.meta.url),'utf8')).replace("'./recommendations'",JSON.stringify(new URL('../lib/recommendations.ts',import.meta.url).href));
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {dispatchRecommendations}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const enc=x=>Buffer.from(JSON.stringify(x)).toString('base64url'),base=enc({alg:'HS256',typ:'JWT'})+'.'+enc({role:'service_role',exp:Math.floor(Date.now()/1000)+600});
const key=base+'.'+createHmac('sha256','cv-local-test-secret-at-least-thirty-two-characters').update(base).digest('base64url');
const id=process.env.CV_TEST_RECEIPT_ID||randomUUID();
const s={id,leaderSlug:'amy-connor',sourcePath:'/leaders/amy-connor',name:'TEST ONLY: Ford Knowlton',role:'Synthetic delivery test',email:'ford@workwithmean.ing',consent:true,answers:{relationship:'Synthetic test only. No real recommendation.',experience:'Synthetic test of the email and private inbox.',impact:'Verify the notification contains every response.',trust:'Synthetic test only; not evidence about Amy.'},recommendation:'TEST ONLY. This is a synthetic form submission to verify delivery to Ford. Do not publish this as an endorsement.'};
if(!process.env.CV_TEST_RECEIPT_ID){
 const saved=await fetch('http://127.0.0.1:3188/api/recommendations',{method:'POST',headers:{'Content-Type':'application/json',Origin:'http://127.0.0.1:3188'},body:JSON.stringify(s)});
 if(saved.status!==201)throw Error('Local submission failed: '+saved.status);
}
const env={RECOMMENDATIONS_DELIVERY_ENABLED:'true',RECOMMENDATIONS_REST_URL:'http://127.0.0.1:54390',RECOMMENDATIONS_SERVICE_ROLE_KEY:key,RESEND_API_KEY:process.env.RESEND_API_KEY};
const send=async(url,options)=>{
 if(url==='https://api.resend.com/emails'){
  const body=JSON.parse(options.body);if(body.to!=='ford@workwithmean.ing')throw Error('Test recipient rejected');
  body.subject='[TEST] '+body.subject;options={...options,body:JSON.stringify(body)};
 } else if(!url.startsWith('http://127.0.0.1:54390/'))throw Error('Unexpected external destination');
 return fetch(url,options);
};
const result=await dispatchRecommendations(id,env,send);
const jobs=await (await fetch(env.RECOMMENDATIONS_REST_URL+`/cv_recommendation_deliveries?submission_id=eq.${id}`,{headers:{Authorization:'Bearer '+key}})).json();
const receipt={id,result,jobs:jobs.map(j=>({kind:j.kind,state:j.state,provider_receipt:j.provider_receipt,last_error:j.last_error}))};
await writeFile('/tmp/cv-recommendation-email-receipt.json',JSON.stringify(receipt,null,2));
console.log(JSON.stringify(receipt,null,2));
