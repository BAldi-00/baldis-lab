// src/app/api/ai/route.ts
// AI Bartender endpoint. Streams plain text back to the page.
//  • With ANTHROPIC_API_KEY set: Claude answers, streamed token by token.
//  • Without it (or if the call fails): the recipe-book bartender in
//    lib/bartender.ts answers from the site's own data.
// The `X-Bartender` response header says which one answered.
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { bartenderAnswer } from '@/lib/bartender';
import { COCKTAILS } from '@/lib/data';

const API_KEY = process.env.ANTHROPIC_API_KEY ?? '';
const AI_ENABLED = API_KEY.startsWith('sk-ant-') && !API_KEY.includes('your-key');
const anthropic = AI_ENABLED ? new Anthropic({ apiKey: API_KEY }) : null;

const SYSTEM_PROMPT = `Sei il bartender di Baldi's Lab, un laboratorio di mixology.
Rispondi con competenza e calore, come un bravo bartender al bancone.
Quando proponi un cocktail indica: ingredienti con le dosi in ml, tecnica, bicchiere e guarnizione.
Se l'utente elenca ciò che ha in casa, proponi drink realizzabili solo con quello (al massimo un ingrediente da comprare, dichiarato).
Quando possibile scegli dal ricettario del sito: ${COCKTAILS.map(c => c.name).join(', ')}.
Risposte brevi: al massimo 3 paragrafi o un elenco puntato compatto, in testo semplice senza markdown (niente asterischi o titoli).
Rispondi nella lingua dell'utente (di default italiano). Non incoraggiare il consumo eccessivo e, se l'utente è minorenne o deve guidare, proponi alternative analcoliche.`;

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

/** Keep a valid history: must start with a user turn, cap size and length. */
function sanitize(raw: unknown): Anthropic.MessageParam[] {
  if (!Array.isArray(raw)) return [];
  const msgs = raw
    .filter((m): m is { role: 'user' | 'assistant'; content: string } =>
      !!m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim().length > 0)
    .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }));
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  return msgs.slice(-20);
}

const textResponse = (body: BodyInit, mode: 'claude' | 'ricettario') =>
  new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Bartender': mode },
  });

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

  const question = String(messages[messages.length - 1].content);
  if (!anthropic) return textResponse(bartenderAnswer(question), 'ricettario');

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sent = false;
      try {
        const run = anthropic.messages.stream({
          model:      'claude-opus-5-5',
          max_tokens: 2048,
          system:     SYSTEM_PROMPT,
          messages,
        });
        run.on('text', text => { sent = true; controller.enqueue(encoder.encode(text)); });
        const final = await run.finalMessage();
        // 'refusal' is newer than the pinned SDK's type union
        if ((final.stop_reason as string) === 'refusal' && !sent) {
          controller.enqueue(encoder.encode('Su questo non posso aiutarti, ma chiedimi pure di cocktail e tecniche.'));
        }
      } catch (err) {
        if (err instanceof Anthropic.AuthenticationError) console.error('[/api/ai] ANTHROPIC_API_KEY non valida');
        else console.error('[/api/ai] Errore Claude:', err);
        // Never leave the user without an answer
        controller.enqueue(encoder.encode(sent ? '\n\n(Risposta interrotta, riprova.)' : bartenderAnswer(question)));
      } finally {
        controller.close();
      }
    },
  });
  return textResponse(stream, 'claude');
}
