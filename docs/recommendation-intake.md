# Recommendation intake

Recommendation intake for Amy Connor and Kevin Lawson's profiles and editorials. It is disabled unless `RECOMMENDATIONS_ENABLED=true` at build and runtime.

## Visitor flow

Four firsthand-experience questions, typing or browser dictation, an assembled editable recommendation, public name and role/company, private email, explicit unchecked publication consent, and a receipt after durable storage. The assembly step uses the visitor's own words and no external model. Dictation availability varies by browser; speech may be processed by the browser's provider. Cincy Voices stores text only. Closing retains the draft while the page remains open; reloading does not.

## Storage and review

`RECOMMENDATIONS_SITE_ORIGIN` must match the exact visitor origin, without a trailing slash. It defaults to the canonical production site URL. Set it explicitly for local or preview deployments; submissions from any other origin are rejected.

Apply both recommendation migrations in an approved environment. Set server-only `RECOMMENDATIONS_REST_URL` to the project's `/rest/v1` endpoint and `RECOMMENDATIONS_SERVICE_ROLE_KEY` to its service-role key. Never use NEXT_PUBLIC for that key. Set `RECOMMENDATIONS_ENABLED=true` only after database and runtime verification. The existing contact form is not reused. No newsletter subscriptions or CRM enrollment happen on submission.

Read the pending inbox with `node --env-file=.env.recommendations.local scripts/review-recommendations.mjs`. Output contains private contributor data; keep it internal. Review in the Supabase dashboard or this operator tool. No public read endpoint is provided. The table has RLS enabled and no anon/authenticated privileges; only the server role can access it. Exact consent text/version, reviewed contributor text, source answers and page, and server receipt time are retained. Duplicate identical retries return the same receipt. Changed content with the same receipt ID is rejected. Three submissions per email per 24 hours are allowed; a honeypot and bounded request body provide additional basic spam resistance. This is not verified email ownership or comprehensive bot protection.

Before publication: confirm the contributor identity and firsthand claim, honor any client confidentiality, check consent and withdrawal status, and show substantive edits to the contributor for approval. Add the approved exact wording to the existing editorial testimonial content only after Ford's release approval. Changing a submission's status does not publish it. Record review status/time and the published destination in review_note. A withdrawal requires removal from any published content as well as marking the submission withdrawn. No automatic publication is enabled.

## Email and Google Sheet delivery

Each new submission atomically creates three private outbox jobs: a complete copy to `ford@workwithmean.ing`, a receipt/thank-you to the contributor, and a 16-column Google Sheet record. Existing records are not backfilled or emailed by the migration. All publication remains moderated. The sender is `Cincy Voices <ford@workwithmean.ing>`; replies from contributors go to Ford. The older contact-form sender at `notifications@voices.workwithmean.ing` was rejected by Resend as unverified during testing and remains outside this change.

The private destination is the Google Sheet configured in `RECOMMENDATIONS_SHEET_ID`. Its `Submissions` tab has 10,000 rows and frozen headers. It contains no real submissions yet. Column order comes from `SHEET_HEADERS` in `lib/recommendation-delivery.ts`. Each submission reserves an identity row in the database. Writes use RAW values to prevent formula execution and reuse the same row on retries. Keep the raw tab in its original row order: do not sort, delete, insert, or manually repurpose its rows. Use filter views or a separate analysis copy. A conflicting row is held for operator review rather than overwritten. Increase grid capacity before the sequence reaches 10,000. Review status in the Sheet is the status at intake; the database remains authoritative for later approval or withdrawal. Withdrawals also require correction of the private Sheet copy according to the retained-data policy.

Activation requires these server-only variables:

- `RECOMMENDATIONS_DELIVERY_ENABLED=true`, only after acceptance testing.
- `RESEND_API_KEY`, the existing sending-only key. Never expose it to the browser.
- `RECOMMENDATIONS_GOOGLE_OAUTH`, JSON containing `client_id`, `client_secret`, and `refresh_token`. The existing Sheets-only OAuth connection used by Claude Code is configured as a Vercel Production Secret. It belongs to Ford and retains its existing Google account access; the application writes only to the configured Sheet. No new Google scopes or service account were created. As an alternative, `RECOMMENDATIONS_GOOGLE_SERVICE_ACCOUNT` accepts a dedicated service-account JSON credential. OAuth takes precedence when both are present.
- `RECOMMENDATIONS_SHEET_ID`.
- `CRON_SECRET`, at least 24 random characters, for the private delivery worker.

The submit route attempts delivery after storage. The authenticated Vercel cron retries every minute, up to three jobs per invocation. Set up Vercel function/cron failure alerting for the owner during activation. Each job has a five-minute lease and an acknowledgement token. Only the current worker can record a receipt. Transient failures use exponential backoff, capped at one hour; 12 attempts or permanent configuration errors require review. Successful email provider IDs and Sheet ranges are stored separately. A provider-accepted email is not proof of inbox delivery or freedom from later bounces. Monitor Resend delivery events for production operations.

Resend idempotency keys last 24 hours. Email jobs older than 23 hours since their first attempt are held, never blindly resent. Reconcile with Resend before resetting an uncertain email job. Provider credentials and error response bodies are not logged. The private worker reports HTTP 503 when new delivery failures or held jobs need attention; the review script includes per-destination status. A failed provider does not cause the form to lose a durably accepted submission or falsely claim that emails/Sheet delivery completed.

Acceptance checks include automated validation, outbox concurrency and retry tests, isolated migration verification, live owner/thank-you email receipt, and exact typed Google Sheets write/readback with duplicate and cleanup checks. Production release receipts are retained privately by the operator.

## Checks

`node --test tests/recommendations.test.mjs tests/recommendation-delivery.test.mjs tests/recommendations.integration.mjs` checks composition, validation, delivery adapters, privacy, concurrent claims, retry deduplication, expired leases, and the email retry cutoff. Integration tests use only the isolated local DB and preview. Run `npm run build`. Exercise the modal at mobile and desktop widths, keyboard dismissal, both leaders, submitted receipt, and saved pending record. Live microphone dictation requires a supported browser and a user-operated microphone test before claiming voice acceptance. `scripts/test-recommendation-email.mjs` is explicitly opt-in, local-DB-only and rejects any recipient except Ford. It requires a private temporary Vercel environment file and must never be used as the production worker.
