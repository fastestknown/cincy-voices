# Recommendation intake

This feature is prepared for Amy Connor and Kevin Lawson's profiles and editorials. It is disabled unless `RECOMMENDATIONS_ENABLED=true` at build and runtime. No migration or feature activation has been applied to production.

## Visitor flow

Four firsthand-experience questions, typing or browser dictation, an assembled editable recommendation, public name and role/company, private email, explicit unchecked publication consent, and a receipt after durable storage. The assembly step uses the visitor's own words and no external model. Dictation availability varies by browser; speech may be processed by the browser's provider. Cincy Voices stores text only. Closing retains the draft while the page remains open; reloading does not.

## Storage and review

`RECOMMENDATIONS_SITE_ORIGIN` must match the exact visitor origin, without a trailing slash. It defaults to the canonical production site URL. Set it explicitly for local or preview deployments; submissions from any other origin are rejected.

Apply `supabase/migrations/20260917184611_recommendation_submissions.sql` in an approved environment. Set server-only `RECOMMENDATIONS_REST_URL` to the project's `/rest/v1` endpoint and `RECOMMENDATIONS_SERVICE_ROLE_KEY` to its service-role key. Never use NEXT_PUBLIC for that key. Set `RECOMMENDATIONS_ENABLED=true` only after database and runtime verification. The existing contact form is not reused: no newsletter, CRM or outbound-email actions happen on submission.

Read the pending inbox with `node --env-file=.env.recommendations.local scripts/review-recommendations.mjs`. Output contains private contributor data; keep it internal. Review in the Supabase dashboard or this operator tool. No public read endpoint is provided. The table has RLS enabled and no anon/authenticated privileges; only the server role can access it. Exact consent text/version, reviewed contributor text, source answers and page, and server receipt time are retained. Duplicate identical retries return the same receipt. Changed content with the same receipt ID is rejected. Three submissions per email per 24 hours are allowed; a honeypot and bounded request body provide additional basic spam resistance. This is not verified email ownership or comprehensive bot protection.

Before publication: confirm the contributor identity and firsthand claim, honor any client confidentiality, check consent and withdrawal status, and show substantive edits to the contributor for approval. Add the approved exact wording to the existing editorial testimonial content only after Ford's release approval. Changing a submission's status does not publish it. Record review status/time and the published destination in review_note. A withdrawal requires removal from any published content as well as marking the submission withdrawn. No automatic publication, sending, or monitoring is enabled.

## Checks

`node --test tests/recommendations.test.mjs` checks composition and validation. Run `npm run build`. Verify database grants and RPC behavior against an isolated Postgres/PostgREST environment. Exercise the modal at mobile and desktop widths, keyboard dismissal, both leaders, submitted receipt, and saved pending record. Live microphone dictation requires a supported browser and a user-operated microphone test before claiming voice acceptance.
