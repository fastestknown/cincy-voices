import { NextRequest,NextResponse } from 'next/server';
import { authorizedWorker,dispatchRecommendations,deliveryRpc } from '@/lib/recommendation-delivery';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=120;
export async function GET(request: NextRequest) {
  if (!authorizedWorker(request.headers.get('authorization'),process.env.CRON_SECRET)) return NextResponse.json({error:'Unauthorized'},{status:401});
  if (process.env.RECOMMENDATIONS_DELIVERY_ENABLED!=='true') return NextResponse.json({error:'Delivery disabled'},{status:503});
  try {
    const result=await dispatchRecommendations();
    const health=await deliveryRpc('cv_recommendation_delivery_health',{});
    const failed=health.needs_review>0 || ('results' in result && result.results?.some(x=>!x.accepted));
    if(failed) console.error('Recommendation delivery needs attention',health);
    return NextResponse.json({...result,health},{status:failed?503:200,headers:{'Cache-Control':'no-store'}});
  }
  catch { return NextResponse.json({error:'Delivery worker could not finish; queued work is retained.'},{status:503}); }
}
