# 🍸 Baldi's Lab — Premium Mixology Platform
**100 cocktail · AI Bartender · Simulatore SVG · 6 temi · PWA · Next.js 15 + Supabase**

---

## 🚀 Eseguire l'app in 5 minuti

### Prerequisiti
- Node.js ≥ 20
- Un progetto [Supabase](https://supabase.com) (free tier OK)
- Una chiave [Anthropic](https://console.anthropic.com) (per l'AI Bartender)

```bash
# 1. Entra nella cartella del progetto Next.js
cd src

# 2. Installa le dipendenze
npm install

# 3. Configura le variabili d'ambiente
cp .env.example .env.local
# → Apri .env.local e compila:
#     NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
#     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
#     SUPABASE_SERVICE_ROLE_KEY=eyJ...    ← mai esposta al client
#     ANTHROPIC_API_KEY=sk-ant-...

# 4. Crea il database (copia e incolla in Supabase SQL Editor)
#    Prima: supabase-schema.sql  (schema + tabelle + RLS + functions)
#    Poi:   supabase/seed.sql    (100 cocktail + 30 ingredienti)

# 5. Avvia in sviluppo
npm run dev
# → http://localhost:3000
```

**Primo accesso**: l'app mostra l'age gate (inserisci la tua data di nascita).
Dopo la verifica sei sulla home page con tutti i 100 cocktail disponibili
senza bisogno di login. Login/registrazione sblocca preferiti e cabinet nel DB.

---

## 🗂 Struttura del progetto

```
.
├── baldis-lab.jsx               ← Artifact standalone (demo istantanea su Claude.ai)
├── README.md
├── architecture.md              ← Architettura tecnica completa
├── supabase-schema.sql          ← Schema DB (14 tabelle, RLS, views, functions)
├── supabase/
│   └── seed.sql                 ← Dati iniziali
└── src/                         ← Progetto Next.js 15
    ├── middleware.ts            ← Session refresh + age gate + auth guard
    ├── app/
    │   ├── page.tsx             ← redirect → /home
    │   ├── layout.tsx           ← Root layout (fonts, SEO metadata)
    │   ├── globals.css          ← Animazioni, a11y, hover tematici
    │   ├── verify-age/page.tsx  ← Pagina age gate (middleware redirect)
    │   ├── login/page.tsx       ← Login (+ ?redirect ?error)
    │   ├── auth/callback/route.ts ← OAuth PKCE callback
    │   ├── (app)/               ← Gruppo con NavBar + AppProvider
    │   │   ├── layout.tsx
    │   │   ├── home/page.tsx
    │   │   ├── simulator/page.tsx
    │   │   ├── cocktails/page.tsx           ← Library con filtri
    │   │   ├── cocktails/[slug]/page.tsx    ← SSG per ogni cocktail
    │   │   ├── ai/page.tsx
    │   │   ├── encyclopedia/page.tsx
    │   │   ├── cabinet/page.tsx
    │   │   └── profile/page.tsx
    │   └── api/
    │       ├── ai/route.ts                  ← Anthropic proxy + rate limit
    │       ├── cocktails/route.ts           ← Search API
    │       ├── cocktails/[id]/route.ts
    │       ├── favorites/route.ts           ← CRUD con Supabase
    │       ├── ratings/route.ts
    │       └── cabinet/route.ts + suggestions/route.ts
    ├── context/
    │   └── AppContext.tsx        ← Provider globale (tema, auth, favorites...)
    ├── components/
    │   ├── glass/GlassSVG.tsx   ← Bicchieri SVG animati
    │   ├── cocktail/CocktailCard.tsx ← Card, Modal, Export PNG, Rating
    │   ├── layout/NavBar.tsx    ← Nav reale (Link/usePathname), AgeGate, AuthModal
    │   ├── home/HomePage.tsx
    │   ├── simulator/SimulatorPage.tsx
    │   ├── library/LibraryPage.tsx
    │   ├── ai/AIPage.tsx        ← chiama /api/ai (chiave server-side)
    │   └── profile/ProfilePage.tsx ← Enciclopedia + Cabinet + Profilo
    ├── lib/
    │   ├── data.ts              ← 100 cocktail + 30 ingredienti (tipizzati)
    │   ├── themes.ts            ← 6 temi (design tokens)
    │   ├── utils.ts             ← Hooks e utility functions
    │   └── supabase/
    │       ├── browser.ts       ← Client browser (singleton)
    │       ├── server.ts        ← Client server (per-request) + admin
    │       └── client.ts        ← Re-export barrel
    ├── types/
    │   └── database.ts          ← Tipi Supabase (run `supabase gen types` per aggiornare)
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts           ← PWA + security headers
    ├── tailwind.config.ts
    └── public/
        └── manifest.json        ← PWA manifest
```

---

## ✨ Feature

| Feature | Stato |
|---------|-------|
| 100 cocktail con storia, metodo, ABV, calorie | ✅ |
| 6 temi stagionali (Night/Day/Estate/Inverno/Halloween/Natale) | ✅ |
| Simulatore SVG animato (6 bicchieri, ghiaccio, garnish, pour stream) | ✅ |
| Riconoscimento automatico del cocktail mentre si costruisce | ✅ |
| AI Bartender via Anthropic (chiave sicura server-side) | ✅ |
| Age gate con verifica data di nascita | ✅ |
| Sistema preferiti ♡/♥ con persistenza DB | ✅ |
| Rating stelle 1-5 per cocktail | ✅ |
| Filtri avanzati (ABV, sapore, difficoltà, bicchiere) | ✅ |
| Export ricetta come PNG (Canvas 2D, 720×960px) | ✅ |
| "Potrebbe piacerti" con navigazione intra-modal | ✅ |
| Cronologia cocktail visti (ultimi 20) | ✅ |
| Bar Cabinet personale con suggerimenti | ✅ |
| Enciclopedia (ingredienti, tecniche, bicchieri) | ✅ |
| Auth: Google OAuth, Apple OAuth, Email/password | ✅ |
| SSG per ogni pagina cocktail (/cocktails/negroni) + JSON-LD | ✅ |
| PWA installabile (manifest + service worker) | ✅ |
| Middleware auth guard + age gate via cookie | ✅ |

---

## 🔑 Autenticazione

```
Google/Apple OAuth:
  1. Configura in Supabase Dashboard → Auth → Providers
  2. Redirect URL: https://tua-app.vercel.app/auth/callback

Email/Password:
  Il form di login invia email + password a:
  supabase.auth.signInWithPassword({ email, password })
  
  Registrazione (Sprint 8): aggiunge anche display_name e crea
  il record in public.user_profiles
```

---

## 🗄 Setup Supabase passo per passo

```sql
-- 1. Nel SQL Editor di Supabase, esegui supabase-schema.sql
-- 2. Poi esegui supabase/seed.sql
-- 3. Configura i provider OAuth in Auth → Providers
-- 4. Aggiungi l'URL del callback: https://tua-app/auth/callback
-- 5. Aggiorna i tipi TypeScript:
npx supabase gen types typescript --project-id <id> > src/types/database.ts
```

---

## 🚀 Deploy su Vercel

```bash
# Installa Vercel CLI
npm i -g vercel

# Dal progetto src/
vercel

# Aggiungi le env vars nel dashboard Vercel:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY
# ANTHROPIC_API_KEY
```

---

## 🎭 Demo istantanea (senza installazione)

Apri `baldis-lab.jsx` come artifact su **Claude.ai** — l'intera app
funziona in-browser con 100 cocktail, simulatore, AI Bartender e 6 temi.
Non richiede Node.js, Supabase o variabili d'ambiente.
