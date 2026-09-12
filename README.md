<div align="center">
  <img src="public/images/logo_wordmark_light.png" alt="DevTrail Logo" width="340" />
  <p><strong>The Developer Proof-of-Work Platform and Career Timeline</strong></p>
</div>

---

## Overview

DevTrail is an engineering intelligence and proof-of-work platform designed for software developers. It automatically turns daily engineering output across GitHub and quick-capture notes into an organized, evidence-grounded timeline of technical accomplishments, decisions, and problem-solving.

Modern developers spend their days navigating complex technical challenges, reviewing pull requests, debugging distributed systems, and architecting solutions. Traditional resumes and commit histories fail to capture the full scope of this impact. DevTrail bridges this gap by unifying automated version control telemetry with lightweight manual capture and structured project mapping.

---

## Key Features

### 1. Unified Activity River
- Aggregates automated GitHub version control events (commits, pull requests, issues) and manual engineering journal entries into a single chronological feed.
- Provides deep event inspection via the Evidence Panel drawer, detailing commit messages, diff summaries, referenced repositories, and direct GitHub links.

### 2. Quick Capture Dock
- Universal dock accessible via the `C` keybinding for capturing notes without context switching.
- Five distinct entry classifications:
  - **Note**: General work log, task notes, or scratchpad context.
  - **Win / Accomplishment**: Milestones and measurable impact.
  - **Learning**: Mastered technical patterns, new frameworks, or concepts.
  - **Blocker**: Impediments, dependency bottlenecks, or production issues.
  - **Decision**: Architectural decisions and rationale.
- Dynamic project association and client-generated idempotency keys (`X-Idempotency-Key`) for network resilience.

### 3. Project Management and Repository Mapping
- Group repositories and journal entries under discrete high-level engineering initiatives.
- Supports multi-repository linking, project color tagging, visibility scopes (private, public, team), and status tracking.

### 4. GitHub App Integration
- Native GitHub App installation flow with dynamic repository synchronization.
- Per-repository activity tracking toggle to pause or resume timeline ingestion for specific repositories.

### 5. Robust Authentication and Onboarding Lifecycle
- Secure credential registration and 6-digit email OTP verification flow with resend rate limits.
- Mandatory profile completion gatekeeper to ensure developer identity is initialized.
- Automatic JWT token rotation via 401 interception and token denylist revocation on logout.

---

## Technical Architecture

DevTrail Web is built as a Next.js App Router client communicating with a dedicated REST backend API.

```text
devtrail-web/
├── public/
│   └── images/               # Logo and brand assets
├── src/
│   ├── app/                  # App Router: layouts, pages, and route groups
│   │   ├── (app)/            # Authenticated core application routes (today, projects, settings)
│   │   ├── (auth)/           # Authentication flows (login, signup, verify-otp)
│   │   ├── (github)/         # GitHub OAuth callback handlers
│   │   └── (onboarding)/     # New user profile setup and completion
│   ├── components/
│   │   ├── feedback/         # Skeletons, error boundaries, and empty state handlers
│   │   ├── layout/           # AppShell, AppHeader, AppSidebar, QuickCaptureDock, InspectorDrawer
│   │   └── ui/               # Reusable primitives
│   ├── features/             # Feature-driven modular architecture
│   │   ├── activities/       # Timeline models, queries, and river items
│   │   ├── auth/             # Session management, login/signup API, and token lifecycle
│   │   ├── github/           # GitHub App linking, repository tracking, and sync hooks
│   │   ├── journal/          # Quick capture domain, CRUD operations, and mutations
│   │   ├── profile/          # Profile completion and user settings
│   │   └── projects/         # Project CRUD, repository attachment, and detail views
│   ├── lib/
│   │   ├── api/              # Unified HTTP client, interceptors, and error handling
│   │   ├── auth/             # Session verification and server-side route guards
│   │   ├── query/            # TanStack Query configuration
│   │   └── utils/            # Helper utilities and class generators
│   ├── stores/               # Zustand UI stores (workbench, inspector, capture dock)
│   └── types/                # Global API envelopes and schema types
```

---

## Technology Stack

- **Framework**: Next.js 15 (App Router with React 19)
- **Language**: TypeScript 5 (Strict Mode)
- **Data Fetching and Server State**: TanStack Query (React Query v5)
- **Client UI State**: Zustand
- **Forms and Validation**: React Hook Form with Zod runtime validation
- **Styling**: Tailwind CSS with custom editorial dark palette
- **Icons**: Lucide React

---

## Getting Started

### Prerequisites

- Node.js 18.18+ or Node.js 20+
- pnpm 9+
- Running DevTrail Backend API instance (local or remote)

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/abdlim/devtrail-web.git
cd devtrail-web
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_APP_NAME="DevTrail"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Backend API URL
API_URL="http://localhost:8000"
NEXT_PUBLIC_API_URL="http://localhost:8000"

# GitHub App Installation URL
NEXT_PUBLIC_GITHUB_APP_URL="https://github.com/apps/devtrail-app-dev/installations/new"
```

### 3. Run the Development Server

```bash
pnpm dev
```

The application will be accessible at `http://localhost:3000`.

---

## Available Scripts

- `pnpm dev`: Starts the Next.js development server with Turbopack.
- `pnpm build`: Builds the optimized production application.
- `pnpm start`: Runs the built production server.
- `pnpm lint`: Runs ESLint for static code analysis.
- `pnpm typecheck`: Executes TypeScript compiler check (`tsc --noEmit`).
- `pnpm test`: Runs the Vitest test suite.
- `pnpm format`: Formats code using Prettier.

---

## Product Roadmap

- **Phase 1**: Core design system, layout shell, and theme architecture.
- **Phase 2**: Identity, OTP email verification, and profile completion gate.
- **Phase 3**: GitHub App integration, repository tracking, and project linking.
- **Phase 4**: Engineering journal, quick capture dock, and unified activity river.
- **Phase 5**: AI evidence layer, work digest generation, and semantic career search.
- **Phase 6**: Public developer portfolio and showcase profiles (`devtrail.com/@username`).
- **Phase 7**: Team collaboration and subscription billing.
