# Next Starter

This is my opinionated Next.js blueprint for building frontend applications backed by a dedicated REST API.

I built this because most Next.js templates try to turn the framework into an all-in-one backend with embedded ORMs, server actions doing database mutations, and messy state boundaries. I prefer a clean separation of concerns: Next.js handles routing, UI, and server-side rendering, while a separate backend (Express, FastAPI, or Go) handles business logic, database operations, and authentication state.

## Core Opinions

- **Next.js is a client, not a database layer.** No Prisma, Drizzle, or direct database connections live here. Everything goes through standard REST calls.
- **Server components are the auth boundary.** Authentication state is resolved server-side in layouts before rendering protected routes. Client-side checks exist purely for UI convenience, never security.
- **No tokens in localStorage.** Sessions rely strictly on `HttpOnly` cookies. The browser client automatically attaches them via credentials, and server components forward them through the `Cookie` header.
- **Feature-first organization.** Everything related to a specific domain (components, hooks, schemas, API callers, types) lives in `src/features/<feature>`. I do not use global dumping grounds like `src/services/`.
- **Zod for all boundaries.** Environment variables, form submissions, and API payloads are validated with Zod schemas at runtime.
- **Minimal global state.** TanStack Query handles server state and caching. Zustand is reserved strictly for genuine client-side UI state (like sidebar toggles).

## Project Structure

```text
src/
├── app/                  # App Router: layouts, pages, error boundaries, route groups
├── components/           # Shared cross-feature UI and layout components
│   ├── feedback/         # Loading, empty, and error state components
│   ├── layout/           # AppShell, AppHeader, AppSidebar, UserMenu
│   └── ui/               # Reusable UI primitives
├── features/             # Domain modules (auth, profile, dashboard)
│   └── <feature>/
│       ├── api/          # Feature-specific fetch callers
│       ├── components/   # Feature-specific components
│       ├── hooks/        # Feature-specific hooks
│       ├── schemas/      # Zod validation schemas
│       └── types/        # TypeScript interfaces and types
├── lib/                  # Shared infrastructure
│   ├── analytics/        # Analytics abstraction
│   ├── api/              # Browser client, server client, ApiError class
│   ├── auth/             # Session helpers, route guards, redirect utils
│   ├── config/           # Validated env and constants
│   ├── query/            # TanStack Query client and provider
│   └── utils/            # Shared utility functions
├── providers/            # React context providers
├── stores/               # Zustand UI stores
└── types/                # Global and shared API envelope types
```

## Authentication Flow

The blueprint implements a complete four-stage auth lifecycle:

1. **Signup / Login**: User registers or signs in with credentials.
2. **OTP Verification**: Verifies email address via a numeric code.
3. **Profile Completion**: Collects required user details before granting app access.
4. **App Dashboard**: Protected routes rendered inside the authenticated layout.

Route guards in `src/app/(app)/layout.tsx` and `src/app/(onboarding)/layout.tsx` enforce this progression server-side.

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Copy the example configuration file:

```bash
cp .env.example .env.local
```

Configure your API endpoints:

```env
NEXT_PUBLIC_APP_NAME="My App"
NEXT_PUBLIC_APP_URL=http://localhost:3000

API_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run development server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Scripts

- `pnpm dev` - Start local development server with Turbopack
- `pnpm build` - Build the production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint checks
- `pnpm typecheck` - Run TypeScript compiler checks (`tsc --noEmit`)
- `pnpm format` - Format all files with Prettier
- `pnpm test` - Run unit and component test suites with Vitest
- `pnpm test:e2e` - Run end-to-end tests with Playwright
