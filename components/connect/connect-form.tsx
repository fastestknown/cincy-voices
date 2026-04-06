'use client';

import { useState } from 'react';

interface ConnectFormProps {
  defaultType?: 'business' | 'leader';
}

export function ConnectForm({ defaultType }: ConnectFormProps) {
  const [type, setType] = useState<'business' | 'leader' | undefined>(defaultType);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, type, message }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-16">
        <p className="font-mono-label text-cv-gold text-xs tracking-widest mb-4">GOT IT</p>
        <h2 className="font-display text-3xl text-cv-light-text font-bold mb-4">
          {type === 'business'
            ? "We'll be in touch soon."
            : "Welcome to the conversation."}
        </h2>
        <p className="text-cv-light-text/50 font-body leading-relaxed max-w-md mx-auto">
          {type === 'business'
            ? "Ford will reach out personally. In the meantime, explore the leaders you've just met."
            : "Ford will follow up with next steps. In the meantime, share your own profile with your network."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Type selector */}
      <div>
        <p className="text-cv-light-text/50 text-sm font-body mb-4">I am a...</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setType('business')}
            className={`py-4 px-5 rounded-xl border text-left transition-all ${
              type === 'business'
                ? 'border-cv-gold bg-cv-gold/10 text-cv-gold'
                : 'border-white/10 text-cv-light-text/50 hover:border-white/30 hover:text-cv-light-text/80'
            }`}
          >
            <p className="font-body font-semibold text-sm">Business Owner</p>
            <p className="font-body text-xs mt-1 opacity-70">Looking to find fractional leadership I can trust</p>
          </button>
          <button
            type="button"
            onClick={() => setType('leader')}
            className={`py-4 px-5 rounded-xl border text-left transition-all ${
              type === 'leader'
                ? 'border-cv-gold bg-cv-gold/10 text-cv-gold'
                : 'border-white/10 text-cv-light-text/50 hover:border-white/30 hover:text-cv-light-text/80'
            }`}
          >
            <p className="font-body font-semibold text-sm">Fractional Leader</p>
            <p className="font-body text-xs mt-1 opacity-70">Looking to build my practice through relationships</p>
          </button>
        </div>
      </div>

      {type && (
        <>
          {/* Context copy */}
          <p className="text-cv-light-text/40 text-sm font-body leading-relaxed border-l-2 border-cv-gold/30 pl-4">
            {type === 'business'
              ? "Work With Meaning will introduce you to fractional leaders uniquely suited to your situation -- vetted through relationships, not resumes."
              : "Join a community of fractional leaders building long-term practices on a foundation of trust. Get access to introductions, trainings, and events."}
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-cv-light-text/50 text-xs font-body tracking-widest mb-2">
                YOUR NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cv-light-text font-body text-sm placeholder-white/20 focus:outline-none focus:border-cv-gold/50 transition-colors"
                placeholder="First and last name"
              />
            </div>
            <div>
              <label className="block text-cv-light-text/50 text-xs font-body tracking-widest mb-2">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cv-light-text font-body text-sm placeholder-white/20 focus:outline-none focus:border-cv-gold/50 transition-colors"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-cv-light-text/50 text-xs font-body tracking-widest mb-2">
                ANYTHING YOU WANT US TO KNOW{' '}
                <span className="text-white/20 normal-case tracking-normal">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cv-light-text font-body text-sm placeholder-white/20 focus:outline-none focus:border-cv-gold/50 transition-colors resize-none"
                placeholder={type === 'business'
                  ? "What's the challenge you're trying to solve?"
                  : "Tell us about your practice and what you're building."}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'submitting' || !name || !email}
            className="w-full bg-cv-gold text-cv-navy font-body font-semibold py-4 rounded-full hover:bg-cv-gold/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
          >
            {status === 'submitting' ? 'Sending...' : 'Send'}
          </button>

          {status === 'error' && (
            <p className="text-cv-rose text-sm text-center font-body">
              Something went wrong. Email ford@workwithmean.ing directly.
            </p>
          )}
        </>
      )}
    </form>
  );
}
