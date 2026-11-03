// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — AI Bartender Page
// src/components/ai/AIPage.tsx
//
// Thin client over our own /api/ai route (the Anthropic key stays server-side).
// The greeting is UI only and is never sent: the API requires the history to
// start with a user message.
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useApp } from '@/context/AppContext';
import { INGREDIENTS } from '@/lib/data';

interface ChatMessage { role: 'user' | 'assistant'; content: string; }

const SUGGESTIONS = [
  'Cosa posso fare con gin, Campari e vermut?',
  'Un drink estivo e leggero, senza alcol',
  'Ho vodka, lime e ginger beer: che preparo?',
  'Differenza tra shake e stir?',
  'Ricetta del Margarita',
];

const GREETING = 'Ciao! Sono il bartender del Lab. Dimmi cosa hai in casa o che serata vuoi, e ti preparo il drink giusto.';

export default function AIPage() {
  const { cabinet } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, loading]);

  const send = async (text = input) => {
    const content = text.trim();
    if (!content || loading) return;
    const history = [...messages, { role: 'user' as const, content }];
    setMessages(history);
    setInput('');
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json().catch(() => ({})) as { content?: string; error?: string };
      if (!res.ok) { setError(data.error ?? 'Qualcosa è andato storto. Riprova.'); return; }
      setMessages(m => [...m, { role: 'assistant', content: data.content ?? '…' }]);
    } catch {
      setError('Connessione assente. Riprova tra un momento.');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const fromBar = () => {
    const names = INGREDIENTS.filter(i => cabinet.has(i.id)).map(i => i.name);
    if (names.length) send(`Nel mio bar ho: ${names.join(', ')}. Cosa posso preparare?`);
  };

  return (
    <div className="wrap flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col pb-6 pt-10">
      <header>
        <div className="eyebrow">AI Bartender</div>
        <h1 className="mt-2 font-display text-5xl">Chiedi al bancone</h1>
      </header>

      <div className="mt-8 flex-1 space-y-4" aria-live="polite">
        <Bubble role="assistant">{GREETING}</Bubble>
        {messages.map((m, i) => <Bubble key={i} role={m.role}>{m.content}</Bubble>)}
        {loading && (
          <Bubble role="assistant">
            <span className="flex gap-1.5 py-1">
              {[0, 1, 2].map(i => <span key={i} className="h-2 w-2 rounded-full bg-accent" style={{ animation: `dots 1.2s ${i * 0.2}s infinite` }} />)}
            </span>
          </Bubble>
        )}
        <div ref={endRef} />
      </div>

      {messages.length === 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {cabinet.size > 0 && (
            <button onClick={fromBar} className="chip" data-active="true"><Icon name="cabinet" size={14} /> Usa il mio bar ({cabinet.size})</button>
          )}
          {SUGGESTIONS.map(s => <button key={s} onClick={() => send(s)} className="chip">{s}</button>)}
        </div>
      )}

      {error && <p className="mt-4 rounded-xl border border-accent-2/30 bg-accent-2/10 px-4 py-2.5 text-sm text-accent-2">{error}</p>}

      <form onSubmit={e => { e.preventDefault(); send(); }}
        className="sticky bottom-4 mt-6 flex items-end gap-2 rounded-3xl border border-line/10 bg-surface p-2 shadow-xl shadow-black/20">
        <textarea
          ref={inputRef}
          value={input}
          rows={1}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Scrivi al bartender…"
          aria-label="Messaggio"
          className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] text-text outline-none placeholder:text-muted/70"
        />
        <button type="submit" disabled={loading || !input.trim()} className="btn-primary h-11 w-11 shrink-0 p-0" aria-label="Invia">
          <Icon name="send" size={17} />
        </button>
      </form>
    </div>
  );
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  const me = role === 'user';
  return (
    <div className={`flex gap-3 ${me ? 'justify-end' : ''}`}>
      {!me && (
        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent"><Icon name="sparkle" size={15} /></span>
      )}
      <div className={`max-w-[85%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-[15px] leading-relaxed ${me ? 'rounded-br-lg bg-accent text-on-accent' : 'rounded-tl-lg border border-line/[0.07] bg-surface/70'}`}>
        {children}
      </div>
    </div>
  );
}
