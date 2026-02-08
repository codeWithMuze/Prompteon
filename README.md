# 🚀 Prompteon SaaS

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![Google Gemini](https://img.shields.io/badge/Google-Gemini-orange?logo=google)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)
![Node](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)
![License](https://img.shields.io/badge/License-MIT-green)

Prompteon is a full-stack AI prompt engineering platform built with **Next.js (App Router)** and powered by **Google Gemini AI**.

It helps users craft, analyze, and refine AI prompts using structured feedback, scoring metrics, and AI-driven optimization.

---

## ⚠️ Node.js Requirement

This project requires:

```
Node.js >= 20.x
```

Google Gemini SDK requires Node 20+.

Check your version:

```bash
node -v
```

If needed, upgrade:

```bash
nvm install 20
nvm use 20
```

---

## ✨ Features

- 🔍 AI-powered prompt analysis
- 🧠 Structured prompt enhancement via Gemini
- 📊 Multi-metric scoring system
- 🔐 Secure authentication with Supabase
- 🧾 Prompt history tracking
- ⏳ 3 free prompts per day (server-enforced)
- 💎 Pro plan-ready architecture
- 🛡 Fully server-side API key isolation
- 🧱 Row-Level Security (RLS) enabled database

---

## 🏗 Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- TypeScript

### Backend
- Next.js API Routes (Server Functions)
- Google Gemini API (server-side only)

### Database & Authentication
- Supabase (PostgreSQL)
- Supabase Auth
- Row Level Security (RLS)

### Deployment
- Vercel-ready

---

## 📂 Project Structure

```
app/
  api/generate/route.ts
  layout.tsx
  page.tsx
  globals.css

components/
lib/
services/
tailwind.config.ts
postcss.config.js
next.config.mjs
types.ts
```

---

## 🔐 Security Architecture

- `GEMINI_API_KEY` used only server-side
- `SUPABASE_SERVICE_ROLE_KEY` isolated in backend
- Client uses only `NEXT_PUBLIC_` variables
- Row Level Security prevents cross-user access
- Usage limits enforced server-side

---

## ⚙️ Environment Setup

Create a `.env.local` file in the root directory:

```
GEMINI_API_KEY=your_gemini_api_key

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

⚠️ Never commit `.env.local` to GitHub.

---

## 🗄 Required Supabase Setup

### Profiles Table

```sql
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  plan text default 'free' check (plan in ('free', 'pro')),
  updated_at timestamptz default now()
);
```

### Prompts Table

```sql
create table public.prompts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  original_prompt text not null,
  improved_prompt text not null,
  score int4 not null,
  created_at timestamptz default now() not null
);
```

Enable Row Level Security:

```sql
alter table public.profiles enable row level security;
alter table public.prompts enable row level security;
```

Policies:

```sql
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can view own prompts"
on public.prompts
for select
using (auth.uid() = user_id);
```

---

## 🧪 Local Development

```bash
npm install
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🏗 Production Build

```bash
npm run build
npm run start
```

---

## 🚀 Deployment (Vercel)

1. Push project to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

---

## 🎯 Project Purpose

Prompteon demonstrates:

- Full-stack SaaS architecture
- Secure AI integration
- Server-side usage enforcement
- Clean separation of client/server logic
- Production-ready Next.js structure

---

## 🔓 Open Source Notice

You must provide your own:
- Google Gemini API key
- Supabase project

No API keys are included in this repository.

---

## 📜 License

MIT License
