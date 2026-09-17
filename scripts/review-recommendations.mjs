// Private operator tool. Does not publish or send anything.
// Usage: node --env-file=.env.recommendations.local scripts/review-recommendations.mjs
const { RECOMMENDATIONS_REST_URL: url, RECOMMENDATIONS_SERVICE_ROLE_KEY: key } = process.env;
if (!url || !key) throw Error('Set RECOMMENDATIONS_REST_URL and RECOMMENDATIONS_SERVICE_ROLE_KEY in a private environment file.');
let offset = 0;
while (true) {
  const response = await fetch(`${url}/cv_recommendation_submissions?status=eq.pending&order=created_at.asc&limit=100&offset=${offset}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw Error(`Inbox read failed (${response.status}).`);
  const rows = await response.json();
  for (const row of rows) console.log(JSON.stringify(row));
  if (rows.length < 100) break;
  offset += rows.length;
}
