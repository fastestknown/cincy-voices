import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { composeRecommendation, validateRecommendation } from '../lib/recommendations.ts';
const answers = { relationship: 'I worked with Amy on a team.', experience: 'She helped us explain our marketing plan.', impact: 'Our team could run the weekly process.', trust: 'She listened carefully and followed through.' };
const valid = () => ({ id: randomUUID(), leaderSlug: 'amy-connor', sourcePath: '/leaders/amy-connor', name: 'Test Person', email: 'TEST@example.com', role: 'Test role', answers, recommendation: composeRecommendation(answers), consent: true });
test('draft preserves exact words and does not invent praise', () => assert.equal(composeRecommendation(answers), Object.values(answers).join('\n\n')));
test('server records the correct consent text and normalizes email', () => { const x = validateRecommendation(valid()); assert.equal(x.email, 'test@example.com'); assert.match(x.consentText, /Amy Connor/); assert.equal(x.consentVersion, '2026-09-17-v1'); });
for (const [label, patch] of Object.entries({ missingConsent: { consent: false }, stringConsent: { consent: 'true' }, forgedPerson: { leaderSlug: 'other' }, wrongSource: { sourcePath: '/leaders/kevin-lawson' }, badEmail: { email: 'not-email' }, emptyAnswers: { answers: {} }, spam: { website: 'spam' }, tooLong: { recommendation: 'x'.repeat(6501) }, badId: { id: 'invalid' } })) {
  test(`rejects ${label}`, () => assert.throws(() => validateRecommendation({ ...valid(), ...patch })));
}

test('four maximum-length answers fit the assembled recommendation', () => { const x = valid(); x.answers = Object.fromEntries(Object.keys(answers).map(key => [key, 'x'.repeat(1500)])); x.recommendation = composeRecommendation(x.answers); assert.equal(x.recommendation.length, 6006); assert.doesNotThrow(() => validateRecommendation(x)); });
