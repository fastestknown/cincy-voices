'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { consentText, composeRecommendation, questions, QUESTION_KEYS, type Answers } from '@/lib/recommendations';

type Recognition = {
  lang: string; continuous: boolean; interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null; onend: (() => void) | null;
  start(): void; stop(): void; abort(): void;
};
type SpeechWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
const RecommendationContext = createContext<{ name: string; open: () => void } | null>(null);
const inputClass = 'mt-2 w-full rounded-lg border border-cv-border bg-white p-3 text-base text-cv-charcoal focus:outline-none focus:ring-2 focus:ring-cv-gold';
const buttonClass = 'rounded-full bg-cv-navy px-5 py-3 text-sm font-medium text-white disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4';

export function RecommendationButton({ compact = false }: { compact?: boolean }) {
  const context = useContext(RecommendationContext);
  if (!context) return null;
  const first = context.name.split(' ')[0];
  return <div className={compact ? 'my-5' : 'my-10 rounded-xl border border-cv-border bg-white/50 p-6'}>
    {!compact && <><h3 className="font-display text-2xl text-cv-charcoal">Know {first}?</h3><p className="mt-2 mb-4 text-sm leading-6 text-cv-muted">A specific experience can help someone else understand what it is like to work together.</p></>}
    <button type="button" onClick={context.open} className={buttonClass}>Share a recommendation for {first}</button>
  </div>;
}

export function RecommendationProvider({ name, slug, children }: { name: string; slug: string; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const recognition = useRef<Recognition | null>(null);
  const path = usePathname();
  const [answers, setAnswers] = useState<Answers>({ relationship: '', experience: '', impact: '', trust: '' });
  const [step, setStep] = useState<'questions' | 'review' | 'success'>('questions');
  const [quote, setQuote] = useState('');
  const [contributor, setContributor] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const [listening, setListening] = useState<string | null>(null);
  const [speechMessage, setSpeechMessage] = useState('');
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const w = window as SpeechWindow;
    setSpeechAvailable(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
    return () => recognition.current?.abort();
  }, []);
  useEffect(() => { if (dialog.current?.open) titleRef.current?.focus(); }, [step]);
  function stopSpeech() { recognition.current?.abort(); recognition.current = null; setListening(null); }
  function close() {
    if (busy) return;
    stopSpeech(); dialog.current?.close(); opener.current?.focus();
  }
  function open() {
    opener.current = document.activeElement as HTMLElement;
    if (!id) setId(crypto.randomUUID());
    setError(''); dialog.current?.showModal(); titleRef.current?.focus();
  }
  function dictate(key: typeof QUESTION_KEYS[number]) {
    if (listening) { stopSpeech(); return; }
    const w = window as SpeechWindow; const Constructor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Constructor) return;
    const instance = new Constructor(); recognition.current = instance;
    instance.lang = 'en-US'; instance.continuous = false; instance.interimResults = false;
    instance.onresult = event => {
      const transcript = Array.from(event.results).map(result => result[0].transcript).join(' ');
      setAnswers(old => ({ ...old, [key]: `${old[key]} ${transcript}`.trim().slice(0, 1500) }));
    };
    instance.onerror = () => { setSpeechMessage('Dictation could not start or was interrupted. You can type your answer instead.'); setListening(null); };
    instance.onend = () => setListening(null);
    setSpeechMessage(''); setListening(key);
    try { instance.start(); } catch { setListening(null); setSpeechMessage('Dictation is unavailable. Please type your answer.'); }
  }
  async function submit() {
    if (busy) return;
    setBusy(true); setError(''); stopSpeech();
    try {
      const result = await fetch('/api/recommendations', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, leaderSlug: slug, sourcePath: path, name: contributor, email, role, answers, recommendation: quote, consent, website }),
      });
      const data = await result.json();
      if (!result.ok) throw Error(data.error || 'Unable to save. Please try again.');
      setStep('success');
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to save. Your text is still here.'); }
    finally { setBusy(false); }
  }
  return <RecommendationContext.Provider value={{ name, open }}>
    {children}
    <dialog ref={dialog} aria-labelledby={`recommendation-title-${slug}`} onCancel={event => { event.preventDefault(); close(); }} className="m-auto w-[calc(100%_-_1rem)] max-w-2xl max-h-[90dvh] overflow-y-auto rounded-2xl bg-cv-cream p-0 text-cv-charcoal shadow-2xl backdrop:bg-black/60">
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-cv-border bg-cv-cream px-5 py-4 sm:px-8">
        <div><p className="font-mono-label text-xs text-cv-muted">YOUR EXPERIENCE MATTERS</p><h2 ref={titleRef} tabIndex={-1} id={`recommendation-title-${slug}`} className="mt-2 font-display text-2xl outline-none">{step === 'success' ? 'Thank you for sharing' : step === 'review' ? 'Review your recommendation' : `Recommend ${name}`}</h2></div>
        <button type="button" disabled={busy} onClick={close} aria-label="Close recommendation form" className="rounded-full px-3 py-2 text-xl focus-visible:outline">×</button>
      </div>
      <div className="p-5 sm:p-8">
        {step === 'questions' && <form onSubmit={event => { event.preventDefault(); stopSpeech(); setQuote(composeRecommendation(answers)); setConsent(false); setStep('review'); }}>
          <p className="mb-5 text-sm leading-6 text-cv-muted">Share something you have seen firsthand. One concrete story is enough. Avoid confidential details or client names you do not have permission to share.</p>
          <p className="mb-6 text-xs leading-5 text-cv-muted">{speechAvailable ? 'You can type or use dictation. Your browser may send audio to its speech provider. We receive only text, not a recording. Starting dictation requests microphone access.' : 'Type your answers below. You can also use your device keyboard’s dictation feature.'}</p>
          <div className="space-y-6">{questions(name).map((label, index) => {
            const key = QUESTION_KEYS[index];
            return <div key={key}><label className="block text-sm font-medium" htmlFor={`${slug}-${key}`}>{index + 1}. {label}</label><textarea id={`${slug}-${key}`} className={inputClass} required minLength={10} maxLength={1500} rows={3} value={answers[key]} onChange={event => setAnswers({ ...answers, [key]: event.target.value })} />
              {speechAvailable && <button type="button" onClick={() => dictate(key)} disabled={listening !== null && listening !== key} className="mt-2 rounded border border-cv-border px-3 py-2 text-sm">{listening === key ? 'Stop dictation' : `Dictate answer ${index + 1}`}</button>}
            </div>;
          })}</div>
          <p role="status" className="mt-3 text-sm">{listening ? 'Listening. Speak naturally, then stop when finished.' : speechMessage}</p>
          <p className="my-5 text-xs leading-5 text-cv-muted">Next, we will assemble your answers into a draft using your own words. You can edit it before submitting.</p>
          <button className={buttonClass}>Create my recommendation</button>
        </form>}
        {step === 'review' && <form onSubmit={event => { event.preventDefault(); void submit(); }}>
          <p className="mb-4 text-sm leading-6 text-cv-muted">These are your answers, assembled without adding claims. Edit them into something you would be comfortable seeing beside your name.</p>
          <label htmlFor={`${slug}-quote`} className="text-sm font-medium">Your recommendation</label><textarea id={`${slug}-quote`} required minLength={40} maxLength={6500} rows={9} className={inputClass} value={quote} onChange={event => { setQuote(event.target.value); setConsent(false); }} disabled={busy} />
          <div className="mt-5 space-y-4">
            <label className="block text-sm">Your name (public)<input required minLength={2} maxLength={120} autoComplete="name" className={inputClass} value={contributor} onChange={event => { setContributor(event.target.value); setConsent(false); }} disabled={busy} /></label>
            <label className="block text-sm">Role / company (public)<input required minLength={2} maxLength={180} autoComplete="organization" className={inputClass} value={role} onChange={event => { setRole(event.target.value); setConsent(false); }} disabled={busy} /></label>
            <label className="block text-sm">Email (private)<input type="email" required maxLength={254} autoComplete="email" className={inputClass} value={email} onChange={event => setEmail(event.target.value)} disabled={busy} /></label>
          </div>
          <div hidden aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></label></div>
          <label className="mt-6 flex items-start gap-3 text-sm leading-6"><input type="checkbox" required className="mt-1 h-5 w-5 shrink-0" checked={consent} onChange={event => setConsent(event.target.checked)} disabled={busy} /><span>{consentText(name)}</span></label>
          <p className="mt-4 text-xs leading-5 text-cv-muted">Submissions are private until reviewed. We use your email to acknowledge receipt and follow up about this recommendation. To correct or withdraw permission, contact <a className="underline" href="mailto:ford@workwithmean.ing">ford@workwithmean.ing</a>.</p>
          {error && <p role="alert" className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-900">{error}</p>}
          <div className="mt-6 flex flex-wrap gap-3"><button className={buttonClass} disabled={busy || !consent}>{busy ? 'Submitting…' : 'Submit for review'}</button><button type="button" disabled={busy} className="rounded-full border border-cv-border px-5 py-3 text-sm" onClick={() => { setConsent(false); setError(''); setStep('questions'); }}>Back to questions</button></div>
        </form>}
        {step === 'success' && <div><p className="leading-7">Your recommendation for {name} has been received for review. It is not public yet. We will contact you if we need clarification or want to make substantive edits.</p><p className="mt-4 break-all text-xs text-cv-muted">Receipt: {id}</p><button type="button" onClick={close} className={`${buttonClass} mt-6`}>Done</button></div>}
      </div>
    </dialog>
  </RecommendationContext.Provider>;
}
