// ─────────────────────────────────────────────────────────────────────────────
// BALDI'S LAB — AI Bartender Page
// src/components/ai/AIPage.tsx
//
// SECURITY NOTE: this calls our own /api/ai route (src/app/api/ai/route.ts),
// which holds the Anthropic key server-side. It does NOT call
// api.anthropic.com directly from the browser — that pattern is only
// appropriate inside the standalone Claude.ai artifact (baldis-lab.jsx),
// where the platform injects/proxies the key safely. In this real Next.js
// app, the key must stay server-side, which is why this component is a
// thin client over our own API route.
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

// ── TYPES ─────────────────────────────────────────────────────────────────────

interface ChatMessage {
  role:    'user' | 'assistant';
  content: string;
}

// ── QUICK SUGGESTIONS ─────────────────────────────────────────────────────────

const SUGGESTIONS = [
  'Cosa posso fare con gin, Campari e vermut?',
  'Qual è la tecnica corretta per un Dry Martini?',
  'Suggeriscimi un cocktail estivo senza alcol',
  'Ho vodka, lime e ginger beer, cosa preparo?',
  'Spiegami la differenza tra shaking e stirring',
  "Qual è l'origine del Negroni?",
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────
// No props — reads theme from AppContext. Rendered from
// src/app/(app)/ai/page.tsx

export default function AIPage() {
  const { t, theme } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role:    'assistant',
    content: "Benvenuto nel Baldi's Lab! 🍸 Sono il tuo AI Bartender. Dimmi cosa hai nel tuo bar o quale emozione vuoi creare questa sera, e ti suggerirò il cocktail perfetto.",
  }]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── API CALL — via OUR server route, not Anthropic directly ────────────────

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: newHistory }),
      });

      if (res.status === 429) {
        setError('Troppe richieste. Riprova tra un minuto.');
        return;
      }
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data  = await res.json() as { content?: string; error?: string };
      const reply = data.content ?? 'Mi dispiace, si è verificato un errore. Riprova.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Errore di connessione. Riprova tra un momento.' }]);
    } finally {
      setLoading(false);
    }
  };

  // ── RENDER ────────────────────────────────────────────────────────────────

  const bubbleStyle = (isUser: boolean): React.CSSProperties => ({
    maxWidth: '76%',
    background:  isUser ? t.goldSoft : t.card,
    border:      `1px solid ${isUser ? t.gold + '30' : t.border}`,
    borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
    padding:     '12px 16px',
  });

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '90px 20px 20px', height: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 40, color: t.text, marginBottom: 4 }}>🤖 AI Bartender</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF50', boxShadow: '0 0 8px #4CAF50' }} />
          <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 13, color: t.textMuted }}>
            Claude AI · Il tuo maestro barman digitale, disponibile 24/7
          </p>
        </div>
      </div>

      {/* Message list */}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16, paddingRight: 4 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 14, alignItems: 'flex-end', gap: 10 }}
          >
            {m.role === 'assistant' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: t.goldSoft, border: `1px solid ${t.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                🍸
              </div>
            )}
            <div style={bubbleStyle(m.role === 'user')}>
              <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: 14, color: t.text, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                {m.content}
              </p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: t.goldSoft, border: `1px solid ${t.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
              🍸
            </div>
            <div style={bubbleStyle(false)}>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    style={{ width: 8, height: 8, borderRadius: '50%', background: t.gold, display: 'inline-block', animation: `glowPulse 1.2s ${i * 0.3}s ease-in-out infinite` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Quick suggestions (only on first load) */}
      {messages.length === 1 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', color: t.textMuted, fontFamily: 'Raleway, sans-serif', marginBottom: 10 }}>DOMANDE FREQUENTI</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                style={{ background: t.tag, border: `1px solid ${t.border}`, borderRadius: 20, padding: '6px 14px', cursor: 'pointer', color: t.textMuted, fontFamily: 'Raleway, sans-serif', fontSize: 12, transition: 'all 0.2s' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rate limit error */}
      {error && (
        <div style={{ padding: '10px 16px', marginBottom: 10, background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 8, color: '#FF6B6B', fontFamily: 'Raleway, sans-serif', fontSize: 13 }}>
          ⚠ {error}
        </div>
      )}

      {/* Input bar */}
      <div style={{ display: 'flex', gap: 10, padding: '14px 16px', background: t.card, border: `1px solid ${t.border}`, borderRadius: 14 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
          placeholder="Chiedi al tuo bartender AI..."
          style={{ flex: 1, background: 'none', border: 'none', color: t.text, outline: 'none', fontFamily: 'Raleway, sans-serif', fontSize: 14 }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            background: loading || !input.trim()
              ? 'none'
              : `linear-gradient(135deg,${t.copper},${t.gold})`,
            border:  `1px solid ${loading || !input.trim() ? t.border : t.gold}`,
            borderRadius: 8, padding: '8px 20px', cursor: loading || !input.trim() ? 'default' : 'pointer',
            color:  loading || !input.trim() ? t.textSub : (theme === 'day' ? '#2a1808' : '#0a0810'),
            fontFamily: 'Raleway, sans-serif', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
          }}
        >
          Invia
        </button>
      </div>
    </div>
  );
}
