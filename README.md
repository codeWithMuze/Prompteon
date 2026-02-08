# Prompteon

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![Google Gemini](https://img.shields.io/badge/Google-Gemini-orange?logo=google)
![Node](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)
![License](https://img.shields.io/badge/License-MIT-green)

Prompteon is a full stack AI prompt engineering application built with Next.js App Router and powered by Google Gemini models.  
It enables users to analyze, optimize, and refine AI prompts using structured scoring, detailed feedback, and production ready rewrites.

The platform is designed with a secure SaaS architecture including authentication, usage enforcement, database isolation, and server side AI processing.

## Overview

Prompteon helps users improve the clarity, structure, and intelligence density of AI prompts.  
Each submitted prompt is analyzed and evaluated across multiple metrics including clarity, specificity, context definition, goal orientation, structural coherence, and constraint completeness.

The system then produces a refined prompt suitable for professional AI workflows.

## Core Features

Secure authentication using Supabase  
Prompt analysis using Google Gemini  
Structured scoring across six evaluation dimensions  
Server side API isolation for AI processing  
Prompt history persistence  
Daily usage enforcement for free users  
Plan ready architecture for future subscription tiers  
Row Level Security enforced database isolation  

## Architecture

Prompteon follows a clean separation between client and server responsibilities.

Client  
Next.js App Router UI  
React components  
Tailwind CSS styling  
Supabase public client for authentication  

Server  
Next.js API routes  
Gemini model invocation  
Usage validation and credit enforcement  
Administrative Supabase service client  

Sensitive credentials such as GEMINI_API_KEY and SUPABASE_SERVICE_ROLE_KEY are strictly confined to server side modules.

## Technology Stack

Frontend  
Next.js 14  
React 18  
TypeScript  
Tailwind CSS  

Backend  
Next.js API Routes  
Google Gemini API  

Database and Authentication  
Supabase PostgreSQL  
Supabase Authentication  
Row Level Security  

Deployment  
Vercel compatible  

## Node Requirement

This project requires Node.js version 20 or higher.

Verify your version

```bash
node -v
```

If needed install Node 20 using nvm

```bash
nvm install 20
nvm use 20
```

## Environment Configuration

Create a file named `.env.local` in the root directory.

Add the following variables

```
GEMINI_API_KEY=your_gemini_api_key

NEXT_PUBLIC_SUPABASE_URL=https://your_project_id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key

SUPABASE_URL=https://your_project_id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Never commit this file to version control.

## Required Database Schema

Profiles table

```sql
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  plan text default 'free' check (plan in ('free', 'pro')),
  updated_at timestamptz default now()
);
```

Prompts table

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

Enable Row Level Security

```sql
alter table public.profiles enable row level security;
alter table public.prompts enable row level security;
```

Policies

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

## Local Development

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Access the application at

```
http://localhost:3000
```

## Production Build

Build optimized bundle

```bash
npm run build
```

Start production server

```bash
npm run start
```

## Deployment

Push the repository to GitHub.  
Import the project into Vercel.  
Configure environment variables in the Vercel dashboard.  
Deploy.

The project is fully compatible with serverless deployment environments.

## Security Model

Gemini API key is executed exclusively in server side modules.  
Supabase service role key is isolated in backend logic.  
Client side code never exposes sensitive credentials.  
Row Level Security ensures users can only access their own records.  
Daily usage limits are validated server side and cannot be bypassed from the frontend.

## Open Source Usage

This repository does not include API credentials.  
To run the project you must provide your own Google Gemini API key and Supabase project configuration.

The codebase is structured to allow safe local development and production deployment without exposing secrets.

## License

MIT License
