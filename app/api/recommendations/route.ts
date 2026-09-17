import { NextRequest, NextResponse } from 'next/server';
import { validateRecommendation } from '@/lib/recommendations';
import { SITE } from '@/lib/constants';

export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
  const reply = (data: object, status: number) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
  if (process.env.RECOMMENDATIONS_ENABLED !== 'true') return reply({ error: 'Recommendations are not open yet. Please try again later.' }, 503);
  const allowedOrigin = process.env.RECOMMENDATIONS_SITE_ORIGIN || SITE.url;
  if (request.headers.get('origin') !== allowedOrigin) return reply({ error: 'Please submit from this website.' }, 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply({ error: 'Invalid request format.' }, 415);
  let submission;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: 'Missing form.' }, 400);
    let size = 0; const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > 32000) { await reader.cancel(); return reply({ error: 'Please shorten your answers.' }, 413); }
      chunks.push(value);
    }
    submission = validateRecommendation(JSON.parse(Buffer.concat(chunks).toString('utf8')));
  } catch (error) {
    return reply({ error: error instanceof SyntaxError ? 'Invalid form data.' : error instanceof Error ? error.message : 'Please check the form.' }, 400);
  }
  const restUrl = process.env.RECOMMENDATIONS_REST_URL;
  const key = process.env.RECOMMENDATIONS_SERVICE_ROLE_KEY;
  if (!restUrl || !key) return reply({ error: 'Submission is temporarily unavailable. Your text is still here; please try again later.' }, 503);
  try {
    const result = await fetch(`${restUrl}/rpc/cv_submit_recommendation`, {
      method: 'POST', cache: 'no-store', signal: AbortSignal.timeout(12000),
      headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` },
      body: JSON.stringify({ p_submission: submission }),
    });
    if (!result.ok) {
      const failure = await result.json().catch(() => ({}));
      if (failure.message === 'rate_limit') return reply({ error: 'Too many submissions. Please try again tomorrow.' }, 429);
      if (failure.message === 'id_conflict') return reply({ error: 'This submission was already received. Please contact ford@workwithmean.ing for corrections.' }, 409);
      return reply({ error: 'We could not save this yet. Your text is still here; please try again.' }, 503);
    }
    return reply({ success: true, id: submission.id, status: 'pending' }, 201);
  } catch {
    return reply({ error: 'We could not confirm receipt. Keep this form open and retry; retries will not create duplicates.' }, 503);
  }
}
