// src/app/api/ai/route.ts
// AI Bartender endpoint. Uses Claude when ANTHROPIC_API_KEY is configured;
// otherwise answers from the local recipe book so the page still works.
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { COCKTAILS, INGREDIENTS, GLASSES } from '@/lib/data';
import { canon } from '@/lib/mix';

const API_KEY = process.env.ANTHROPIC_API_KEY ?? '';
const AI_ENABLED = API_KEY.startsWith('sk-ant-') && !API_KEY.includes('your-key');
const anthropic = AI_ENABLED ? new Anthropic({ apiKey: API_KEY }) : null;

const SYSTEM_PROMPT = `Sei il bartender di Baldi's Lab, un laboratorio di mixology.
Rispondi con competenza e calore, come un bravo bartender al bancone.
Quando proponi un cocktail indica: ingredienti con le dosi in ml, tecnica, bicchiere e guarnizione.
Se l'utente elenca ciò che ha in casa, proponi drink realizzabili solo con quello (al massimo un ingrediente da comprare, dichiarato).
Risposte brevi: al massimo 3 paragrafi o un elenco puntato compatto, senza titoli markdown.
Rispondi nella lingua dell'utente (di default italiano). Non incoraggiare il consumo eccessivo e, se l'utente è minorenne o alla guida, proponi alternative analcoliche.`;

// Simple in-memory rate limiter (use Upstash Redis for multi-instance deployments)
const rl = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 15, WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now(), data = rl.get(ip);
  if (!data || now > data.reset) { rl.set(ip, { count: 1, reset: now + WINDOW_MS }); return true; }
  if (data.count >= RATE_LIMIT) return false;
  data.count++;
  return true;
}

/** Keep a valid alternating history: must start with a user turn, cap size. */
function sanitize(raw: unknown): Anthropic.MessageParam[] {
  if (!Array.isArray(raw)) return [];
  const msgs = raw
    .filter((m): m is { role: 'user' | 'assistant'; content: string } =>
      !!m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim().length > 0)
    .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }));
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  return msgs.slice(-20);
}

// ── Local fallback ────────────────────────────────────────────────────────────

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Everyday words → the pantry bottle they usually mean
const GENERIC: Record<string, string> = {
  gin: 'Gin London Dry', rum: 'Rum Bianco', tequila: 'Tequila Blanco', whisky: 'Bourbon', whiskey: 'Bourbon',
  vermut: 'Vermut Rosso', vermouth: 'Vermut Rosso', soda: 'Soda Water', tonica: 'Acqua Tonica', zucchero: 'Sciroppo',
};

function recipeText(c: (typeof COCKTAILS)[number]) {
  return `${c.name} (${GLASSES[c.glass]?.name ?? c.glass}, ${c.abv}%):\n` +
    c.ings.map(i => `• ${i.amount} ml ${canon(i.name)}`).join('\n') +
    `\n${c.method}\nGuarnizione: ${c.garnish}.`;
}

function localAnswer(question: string): string {
  const q = norm(question);
  const named = COCKTAILS.find(c => q.includes(norm(c.name)));
  if (named) return `Ecco la ricetta.\n\n${recipeText(named)}`;

  const wantsZero = /analcol|senza alcol|zero/.test(q);
  // Whole-word matches only ("ginger beer" must not count as "gin")
  const word = (w: string) => new RegExp(`(^|[^a-z])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z]|$)`).test(q);
  const have = new Set(INGREDIENTS.filter(i => word(norm(i.name))).map(i => i.name));
  for (const [generic, name] of Object.entries(GENERIC)) {
    const family = name.split(' ')[0];
    if (word(generic) && ![...have].some(h => h.startsWith(family))) have.add(name);
  }
  const scored = COCKTAILS
    .filter(c => !wantsZero || c.abv === 0)
    .map(c => {
      const names = c.ings.map(i => canon(i.name));
      const hit = names.filter(n => have.has(n)).length;
      return { c, hit, miss: names.length - hit };
    })
    .filter(x => (have.size ? x.hit > 0 : true))
    // Fewest missing bottles first: what you can make right now wins
    .sort((a, b) => a.miss - b.miss || b.hit - a.hit)
    .slice(0, 3);

  if (!scored.length) {
    return 'Dimmi quali bottiglie hai (es. "gin, Campari e vermut") o il nome di un cocktail e ti preparo la ricetta.';
  }
  const intro = have.size
    ? `Con ${[...have].join(', ')} ti propongo:`
    : wantsZero ? 'Ecco un analcolico che ti consiglio:' : 'Qualche idea dal ricettario:';
  return `${intro}\n\n${scored.map(x => recipeText(x.c)).join('\n\n')}\n\n(Modalità offline: configura ANTHROPIC_API_KEY per risposte su misura.)`;
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'anonymous';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Troppe richieste. Riprova tra un minuto.' }, { status: 429 });
  }

  let messages: Anthropic.MessageParam[];
  try {
    messages = sanitize((await req.json())?.messages);
  } catch {
    return NextResponse.json({ error: 'Richiesta non valida.' }, { status: 400 });
  }
  if (!messages.length) return NextResponse.json({ error: 'Messaggi mancanti.' }, { status: 400 });

  if (!anthropic) {
    const last = messages[messages.length - 1];
    return NextResponse.json({ content: localAnswer(String(last.content)), offline: true });
  }

  try {
    const response = await anthropic.messages.create({
      model:      'claude-opus-5-5',
      max_tokens: 2048,
      system:     SYSTEM_PROMPT,
      messages,
    });

    // 'refusal' is newer than the pinned SDK's type union
    if ((response.stop_reason as string) === 'refusal') {
      return NextResponse.json({ content: 'Su questo non posso aiutarti, ma chiedimi pure di cocktail e tecniche.' });
    }
    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map(b => b.text)
      .join('\n')
      .trim();
    return NextResponse.json({ content: text || 'Non ho una risposta, prova a riformulare.' });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: 'Il bartender è molto richiesto, riprova tra poco.' }, { status: 429 });
    }
    if (err instanceof Anthropic.AuthenticationError) {
      console.error('[/api/ai] Invalid ANTHROPIC_API_KEY');
    } else {
      console.error('[/api/ai] Error:', err);
    }
    const last = messages[messages.length - 1];
    return NextResponse.json({ content: localAnswer(String(last.content)), offline: true });
  }
}
