# FrameWise AI - Implementation Plan

> **Project**: AI-powered PC Gaming Performance Analyzer
> **Stack**: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, shadcn/ui, Prisma ORM, PostgreSQL, NextAuth.js, Redis, OpenRouter API

---

## Phase 0 — Project Scaffold & Dev Infrastructure

- [ ] Initialize Next.js 15 with App Router + TypeScript
- [ ] Install and configure Tailwind CSS, shadcn/ui, Framer Motion, Recharts, TanStack Query, React Hook Form, Zod
- [ ] Set up Prisma with SQLite (dev) and PostgreSQL schema (production-ready)
- [ ] Configure NextAuth.js with JWT sessions
- [ ] Set up project folder structure (`app/`, `components/`, `features/`, `actions/`, `hooks/`, `services/`, `lib/`, `prisma/`, `types/`, `config/`)
- [ ] Configure Redis client utility
- [ ] Set up ESLint, Prettier, and basic `tsconfig` paths
- [ ] Configure environment variable templates (`.env.example`)
- [ ] Initialize Git repository with `.gitignore`

---

## Phase 1 — Core Database Schema & Prisma

- [ ] Define Prisma schema models:
  - [ ] `User`, `Account`, `Session`, `VerificationToken` (NextAuth)
  - [ ] `Game`, `Developer`, `Publisher`, `Genre`, `GameGenre`
  - [ ] `Hardware` (CPU, GPU, RAM, storage, motherboard, monitor, OS)
  - [ ] `Benchmark` (per-game FPS data per resolution/quality)
  - [ ] `Requirement` (min/recommended specs per game)
  - [ ] `Recommendation` (upgrade suggestions)
  - [ ] `HardwarePrice` (country + store specific pricing)
  - [ ] `Country`, `Currency`
  - [ ] `AIConversation`, `SearchHistory`
- [ ] Create seed script with initial game/hardware data
- [ ] Run initial migration

---

## Phase 2 — Authentication System

- [ ] Set up NextAuth.js configuration (credentials + Google + GitHub OAuth)
- [ ] Build `/api/auth/*` route handlers (register, login, logout)
- [ ] Create UI pages:
  - [ ] `/login` — Email/password + OAuth buttons
  - [ ] `/register` — Registration form with email verification flow
  - [ ] `/forgot-password` — Request reset link
  - [ ] `/reset-password` — Set new password
- [ ] Implement middleware for route protection (`/dashboard/*`, `/admin/*`)
- [ ] Build email service integration (Resend) for verification & password reset
- [ ] Create `User` role enum (User, Admin)

---

## Phase 3 — Shared UI Components & Design System

- [ ] Set up global CSS variables (theme colors, dark/light mode, FPS indicator colors)
- [ ] Build shadcn/ui theme configuration
- [ ] Create shared layout components:
  - [ ] `Navbar` (public / authenticated variants)
  - [ ] `Footer`
  - [ ] `Sidebar` (dashboard layout)
  - [ ] `MobileNav`
- [ ] Build reusable components:
  - [ ] `FPSChip` — colored badge (Red/Yellow/Green/Blue/Purple)
  - [ ] `PerformanceBar` — visual FPS indicator
  - [ ] `HardwareCard` — CPU/GPU summary display
  - [ ] `SearchInput` — global search bar
  - [ ] `GameCard` — game thumbnail + FPS summary
  - [ ] `LoadingSkeleton` — consistent loading states
  - [ ] `EmptyState` — for empty pages/sections
  - [ ] `ErrorBoundary` — graceful error handling

---

## Phase 4 — Marketing / Public Pages

- [ ] Landing page (`/`) — Hero, Features, Pricing, CTA
- [ ] `/about` — About FrameWise
- [ ] `/features` — Detailed feature showcase
- [ ] `/pricing` — Pricing tiers (free/paid if applicable)
- [ ] `/contact` — Contact form
- [ ] `/privacy` — Privacy policy
- [ ] `/terms` — Terms of service
- [ ] `/blog` — Blog listing page
- [ ] `/changelog` — Version changelog
- [ ] Global search (`/api/search` + UI overlay) for games, GPUs, CPUs, developers, publishers

---

## Phase 5 — Games Module

- [ ] Build `/games` page with:
  - [ ] Search input
  - [ ] Filters (Genre, Developer, Publisher, Release Year, Min FPS, Resolution)
  - [ ] Sorting (Newest, Highest FPS, Lowest FPS, Most Popular)
  - [ ] Game grid with lazy loading / pagination
- [ ] Build `/games/[slug]` detail page with:
  - [ ] Hero section (cover, title, developer, publisher, genre, release date, engine)
  - [ ] Performance table: 720p / 1080p / 1440p / 4K × Ultra / High / Medium / Low
  - [ ] FPS color coding (Red 0-29, Yellow 30-59, Green 60-89, Blue 90-119, Purple 120+)
  - [ ] Requirements section (Minimum / Recommended)
  - [ ] AI Analysis section (Performance explanation, Upgrade advice, Optimization tips, Budget recommendations)
  - [ ] Related games carousel
- [ ] API routes: `GET /api/games`, `GET /api/games/:slug`

---

## Phase 6 — Hardware Detection Companion App

- [ ] Design hardware sync protocol (JSON payload schema)
- [ ] Build Windows companion app (Electron / Tauri / .NET):
  - [ ] Detect CPU, GPU, RAM, storage, motherboard, monitor resolution, OS
  - [ ] Authenticate with user account (token-based)
  - [ ] Upload hardware profile via `POST /api/hardware/sync`
  - [ ] Periodic sync (polling / scheduled)
- [ ] Web fallback: detect browser-limited info (screen resolution, OS hints)
- [ ] API route: `GET /api/hardware`, `POST /api/hardware/sync`

---

## Phase 7 — Dashboard

- [ ] Build `/dashboard` page with sections:
  - [ ] **Hardware Summary** — detected components overview
  - [ ] **Gaming Score** — overall performance score
  - [ ] **Performance Overview** — charts (Recharts) of FPS across recent games
  - [ ] **Latest Games** — recently browsed games with FPS
  - [ ] **Upgrade Recommendation** — single top-priority upgrade suggestion
  - [ ] **Recent Searches** — search history
  - [ ] **Quick Search** — inline game search
- [ ] `/my-pc` — detailed hardware profile view
- [ ] `/history` — full search and browsing history

---

## Phase 8 — Upgrade Planner

- [ ] Build `/upgrade-planner` page:
  - [ ] Input fields: Budget, Preferred Resolution, Preferred FPS, Graphics Quality
  - [ ] Output:
    - [ ] Recommended GPU + price
    - [ ] Recommended CPU + price
    - [ ] Estimated FPS after upgrade
    - [ ] Store links with country-specific pricing
- [ ] Pricing module:
  - [ ] `HardwarePrice` table with country, store, price columns
  - [ ] Scheduled jobs or admin data entry for pricing updates
- [ ] API route: `POST /api/upgrade`

---

## Phase 9 — AI Assistant

- [ ] Build `/ai` chat page:
  - [ ] Chat interface with message history
  - [ ] Context-aware using user's synced hardware profile
- [ ] Integrate OpenRouter API:
  - [ ] GPT-5.5 / Claude Sonnet / Gemini (user-selectable)
  - [ ] Structured prompt engineering for:
    - [ ] "Can I play [game]?" — hardware analysis + expected FPS
    - [ ] "How to reach 144 FPS?" — optimization guide
    - [ ] "What to upgrade first?" — upgrade priority + pricing
    - [ ] "My budget is X" — budget-specific recommendations
    - [ ] Compare two GPUs/CPUs in user's context
    - [ ] Suggest optimal in-game graphics settings
    - [ ] Recommend games suited to user's hardware
- [ ] Save conversation history to DB (`AIConversation`)
- [ ] API route: `POST /api/ai/chat`

---

## Phase 10 — User Profile & Settings

- [ ] `/profile` page:
  - [ ] Avatar upload
  - [ ] Username, email display
  - [ ] Connected hardware profiles
  - [ ] Statistics (games searched, upgrades planned, etc.)
- [ ] `/settings` page:
  - [ ] Theme toggle (light/dark)
  - [ ] Country + Currency selection
  - [ ] Preferred resolution default
  - [ ] Language selection
  - [ ] Notification preferences
- [ ] `/account` — account management (delete, export data)
- [ ] API routes: `GET/PATCH /api/profile`, `GET/PATCH /api/settings`

---

## Phase 11 — Admin Panel

- [ ] Admin middleware + role guard
- [ ] `/admin` dashboard — overview stats
- [ ] `/admin/games` — CRUD game entries
- [ ] `/admin/game/new` + `/admin/game/edit/[id]` — game form
- [ ] `/admin/hardware` — manage hardware catalog
- [ ] `/admin/prices` — manage country-specific pricing
- [ ] `/admin/users` — user management (ban, role change)
- [ ] `/admin/benchmarks` — manage FPS benchmark data
- [ ] `/admin/blog` — CRUD blog posts

---

## Phase 12 — External Integrations & Services

- [ ] **IGDB API** — sync game metadata (covers, genres, release dates)
- [ ] **RAWG API** — fallback for covers/screenshots
- [ ] **Cloudinary** — image upload & optimization
- [ ] **Resend** — transactional emails (verification, password reset)
- [ ] **Sentry** — error monitoring setup
- [ ] **PostHog / Umami** — analytics & user behavior tracking
- [ ] **Google Analytics** (optional)

---

## Phase 13 — Performance, Caching & Optimization

- [ ] Configure Redis caching layer for:
  - [ ] Game search results
  - [ ] FPS predictions / benchmarks
  - [ ] Hardware prices
  - [ ] AI conversation history (TTL)
- [ ] Implement TanStack Query for client-side data fetching + caching
- [ ] Optimize images with Next.js Image component + Cloudinary
- [ ] Add loading skeletons for all data-dependent views
- [ ] Implement infinite scroll / pagination for games list
- [ ] Add request rate limiting for API routes
- [ ] Configure Vercel analytics & speed insights

---

## Phase 14 — Testing & Quality Assurance

- [ ] Write unit tests for:
  - [ ] Utility functions (`lib/utils.ts`, validators)
  - [ ] Server actions (`actions/`)
  - [ ] Prisma queries
- [ ] Write integration tests for API routes
- [ ] Write E2E tests (Playwright) for critical flows:
  - [ ] Auth flow (register → verify → login)
  - [ ] Hardware sync → dashboard display
  - [ ] Game search → details → AI analysis
  - [ ] Upgrade planner → results
- [ ] Accessibility audit (keyboard navigation, screen reader, contrast)
- [ ] Performance audit (Lighthouse, Core Web Vitals)

---

## Phase 15 — Deployment & Launch

- [ ] Production deployment to Vercel
- [ ] Provision Neon PostgreSQL database
- [ ] Set up Redis instance (Upstash / Redis Cloud)
- [ ] Configure custom domain + SSL
- [ ] Set up CI/CD (GitHub Actions):
  - [ ] Lint → Type check → Test → Build → Deploy
- [ ] Configure Vercel environment variables
- [ ] Set up monitoring (Sentry, PostHog)
- [ ] Create production seed data (games, benchmarks, hardware)
- [ ] Final security review (auth, rate limiting, SQL injection, XSS, CSRF)

---

## Phase 16 — Post-Launch & Iteration

- [ ] Collect user feedback
- [ ] Monitor error rates & performance
- [ ] Add more games and benchmarks
- [ ] Expand hardware detection to macOS / Linux
- [ ] Community features (user benchmarks sharing)
- [ ] Mobile app (React Native) if warranted
