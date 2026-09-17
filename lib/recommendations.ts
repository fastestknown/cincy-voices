export const RECOMMENDATION_LEADERS = {
  'amy-connor': 'Amy Connor',
  'kevin-lawson': 'Kevin Lawson',
} as const;
export type RecommendationLeader = keyof typeof RECOMMENDATION_LEADERS;
export const CONSENT_VERSION = '2026-09-17-v1';
export function consentText(name: string) {
  return `I confirm this recommendation reflects my firsthand experience. I authorize Cincy Voices and Work With Meaning to publish the exact recommendation I reviewed, with my name and role/company, on ${name}'s profile and editorial. Any substantive edits require my approval. My email address will not be published.`;
}
export const QUESTION_KEYS = ['relationship', 'experience', 'impact', 'trust'] as const;
export type Answers = Record<typeof QUESTION_KEYS[number], string>;
export function questions(name: string) {
  const first = name.split(' ')[0];
  return [
    `How do you know ${first}, and what work have you done together?`,
    `Describe a specific situation. What did ${first} do that stood out?`,
    'What changed for the business, team, or you as a result?',
    `What gives you confidence recommending ${first}? If you've made an introduction, what earned that trust?`,
  ];
}
// Compose only the contributor's own words. No paid model, invented claims, or inferred praise.
export function composeRecommendation(answers: Answers) {
  return QUESTION_KEYS.map(key => answers[key].trim()).filter(Boolean).join('\n\n');
}
export function validateRecommendation(input: unknown) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw Error('Please complete the form.');
  const x = input as Record<string, unknown>;
  const text = (value: unknown, min: number, max: number, label: string) => {
    if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) throw Error(`Please check ${label}.`);
    return value.trim();
  };
  if (x.website) throw Error('Unable to accept this submission.');
  const leaderSlug = text(x.leaderSlug, 1, 80, 'the person');
  if (!Object.hasOwn(RECOMMENDATION_LEADERS, leaderSlug)) throw Error('This person is not accepting recommendations.');
  const name = RECOMMENDATION_LEADERS[leaderSlug as RecommendationLeader];
  const id = text(x.id, 36, 36, 'the submission');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) throw Error('Please reopen the form.');
  const email = text(x.email, 3, 254, 'your email').toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Error('Please check your email.');
  if (x.consent !== true) throw Error('Please authorize publication of the recommendation you reviewed.');
  if (!x.answers || typeof x.answers !== 'object') throw Error('Please answer the four questions.');
  const answers = Object.fromEntries(QUESTION_KEYS.map(key => [key, text((x.answers as Record<string, unknown>)[key], 10, 1500, 'your answers')])) as Answers;
  const sourcePath = text(x.sourcePath, 1, 160, 'the source page');
  const editorial = leaderSlug === 'amy-connor' ? 'amy-connor-working-herself-out-of-a-job' : 'kevin-lawson-more-than-a-full-practice';
  if (![ `/leaders/${leaderSlug}`, `/editorial/${editorial}` ].includes(sourcePath)) throw Error('Please submit from the profile or editorial.');
  return {
    id, leaderSlug, sourcePath, email, answers,
    name: text(x.name, 2, 120, 'your name'),
    role: text(x.role, 2, 180, 'your role/company'),
    recommendation: text(x.recommendation, 40, 6500, 'your recommendation'),
    consent: true, consentVersion: CONSENT_VERSION, consentText: consentText(name),
  };
}
