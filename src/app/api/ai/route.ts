// src/app/api/ai/route.ts
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const SYSTEM_PROMPT = `Sei il maestro bartender AI di Baldi's Lab, un laboratorio premium di mixology.
Rispondi con passione, competenza e stile elegante.
Quando suggerisci cocktail, includi sempre: ingredienti principali, tecnica, bicchiere consigliato e garnish.
Mantieni le risposte concise (max 3 paragrafi) ma ricche di dettagli tecnici.
Rispondi in italiano o nella lingua dell'utente.`;

// Simple in-memory rate limiter (replace with Upstash Redis for multi-instance deployments)
const rl = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 15, WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now(), data = rl.get(ip);
  if (!data || now > data.reset) { rl.set(ip, { count: 1, reset: now + WINDOW_MS }); return true; }
  if (data.count >= RATE_LIMIT) return false;
  data.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Troppe richieste. Riprova tra un minuto.' }, { status: 429 });
  }

  try {
    const { messages } = await req.json() as { messages: { role: string; content: string }[] };
    if (!messages?.length) {
      return NextResponse.json({ error: 'Messaggi mancanti.' }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system:     SYSTEM_PROMPT,
      messages:   messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    });

    const text = response.content[0]?.type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ content: text });
  } catch (err) {
    console.error('[/api/ai] Error:', err);
    return NextResponse.json({ error: 'Errore interno. Riprova tra un momento.' }, { status: 500 });
  }
}
