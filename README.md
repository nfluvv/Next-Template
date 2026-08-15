# Next.js Auth Template (FSD)

A production-minded Next.js starter with a full authentication and account-management system already built in, structured with Feature-Sliced Design (FSD). Clone it, add your own domain features, and ship.

## Why this exists

Most starters give you a login form and call it done. This one is meant to be the *boring, correct* baseline every real product needs before you touch business logic: credentials + OAuth, email verification, password reset, 2FA, an admin panel, rate limiting, and a defensible security model around account linking — all wired up and battle-tested against real edge cases.

## Tech stack

- **Next.js** (App Router, Turbopack) — React framework
- **NextAuth.js v5 (Auth.js)** — authentication, session management
- **Prisma** + **PostgreSQL** — database and ORM
- **Zustand** — client state (theme store)
- **TanStack Query (React Query)** — server-state caching for the admin panel
- **React Hook Form** + **Zod** — forms and validation, shared schemas between client and server
- **shadcn/ui** + **Tailwind CSS 4** — UI components and styling
- **Cloudinary** — avatar image storage and processing
- **Resend** — transactional email (with a console-log fallback for local dev)
- **otpauth** — TOTP (2FA) generation and verification
- **Feature-Sliced Design** — enforced via `eslint-plugin-boundaries`

## Features

### Authentication
- Email + password (credentials) login and registration
- OAuth login via **Google** and **GitHub**
- Safe account linking: an OAuth provider can only be linked to an existing password-protected account if the request comes from that account's own active session (prevents pre-registration account-takeover attacks)
- Unlink OAuth providers from settings (blocked if it would leave the account with no way to log in)

### Email verification
- Required before a credentials account can log in
- Verification is a manual, explicit action (button click, not an auto-fired GET request) — protects against email-scanner/antivirus bots silently consuming single-use tokens
- Auto-login after successful verification via a short-lived, HMAC-signed one-time token (no password re-entry needed)
- Stale/incomplete registrations (unverified) on an email are automatically overwritten by a new registration attempt, so an attacker can't permanently squat someone else's email

### Password management
- Forgot-password flow with time-limited, single-use reset tokens
- Change/set password from account settings (works for both credentials and OAuth-only users who want to add a password as a backup login method)
- Live password strength indicator

### Two-Factor Authentication (TOTP)
- Standard RFC 6238 TOTP, compatible with Google Authenticator, Authy, etc.
- QR code + manual secret entry during setup
- Setup requires confirming a real code before 2FA is actually enabled
- One-time backup codes (hashed, single-use) for lost-device recovery
- TOTP secret is encrypted at rest (AES-256-GCM), not stored in plaintext

### Account & profile
- Editable display name and unique username
- Avatar upload via signed, direct-to-Cloudinary client uploads (server never touches the file)
- Change email (only available for accounts that aren't OAuth-only, to avoid a confusing mismatch between the linked provider's identity and a manually-changed email)
- Full account deletion, gated behind password/2FA re-confirmation where applicable

### Admin panel
- Paginated, searchable user list (debounced search, React Query caching)
- Role management with confirmation dialog before granting admin rights
- Role-change audit log
- Route-level protection independent of authentication status (a logged-out visitor and a non-admin see the same generic "forbidden", so the existence of the panel isn't hinted at)

### Security hardening
- Postgres-backed rate limiting (no external services required) on login, registration, password reset requests, email verification requests, and account deletion
- Timing-safe comparisons for signed tokens
- Anti-enumeration responses on password-reset and email-verification requests (the API never reveals whether an email exists in the system)
- Session re-validation against the database on every request — a deleted or banned user is logged out immediately, not after their JWT happens to expire

### UX niceties
- Light/dark/system theme via a small Zustand store, no flash-of-wrong-theme on load
- Toast-based error/success messaging across every auth flow
- Skeleton loading states, optimistic UI where it makes sense

## Project structure (Feature-Sliced Design)

```
src/
  app/          # App-layer providers (session, theme, react-query)
  views/        # Page-level compositions, rendered by thin route files
  widgets/      # Composite UI blocks (header, admin users table, ...)
  features/     # User-triggered actions (login, register, 2FA setup, ...)
  entities/     # Domain data: types, schemas, read-only queries, core lib code
  shared/       # Framework-agnostic infrastructure: UI kit, config, utils
app/             # Next.js routing only — every route is a thin wrapper around a `views/*` component
```

Import direction is enforced by `eslint-plugin-boundaries`:
`shared → entities → features → widgets → views → app`. A lower layer can never import from a higher one.

## Getting started

### Prerequisites
- Node.js 22+
- Docker (for local Postgres) — or your own PostgreSQL instance

### 1. Install dependencies
```bash
npm install
```

### 2. Start the database
```bash
docker compose up -d
```

### 3. Configure environment variables
```bash
cp .env.example .env
```
Fill in the values — see the table below for where to get each one.

### 4. Run migrations
```bash
npx prisma migrate dev
```

### 5. Start the dev server
```bash
npm run dev
```

App runs at `http://localhost:3000`.

## Environment variables

> See `.env.example` for the full list with inline comments. Quick reference:

| Variable | Required | Where to get it |
|---|---|---|
| `DATABASE_URL` | Yes | Your Postgres connection string |
| `AUTH_SECRET` | Yes | Generate with `npx auth secret` |
| `NEXTAUTH_URL` | Yes | `http://localhost:3000` in dev |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | Yes | [GitHub OAuth Apps](https://github.com/settings/developers) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Yes | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `MAIL_PROVIDER` | Yes | `console` for local dev (logs emails to the terminal instead of sending them), `resend` for real delivery |
| `RESEND_API_KEY` / `EMAIL_FROM` | Only if `MAIL_PROVIDER=resend` | [resend.com](https://resend.com) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Yes | [cloudinary.com](https://cloudinary.com) dashboard |
| `TWO_FACTOR_ENCRYPTION_KEY` | Yes | Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

**Note on local development:** with `MAIL_PROVIDER=console`, no real email provider is required at all — verification and password-reset links are printed straight to your terminal, so you can register as many test accounts as you like without hitting any provider's sending limits.

## Scripts

```bash
npm run dev        # Start dev server (Turbopack)
npm run build       # Production build
npm run lint         # ESLint (includes FSD boundary checks)
npx tsc --noEmit    # Type-check without emitting files
npx prisma studio   # Visual database browser
```

## CI

GitHub Actions runs lint, type-check, and a full production build (against a throwaway Postgres service container) on every push and pull request to `main`. See `.github/workflows/ci.yml`.

## Known trade-offs

Documented here on purpose, so nobody mistakes them for oversights:

- **JWT sessions, not database sessions.** Simpler and cheaper, but there's no built-in "list your active devices and revoke one" feature — that would require switching session strategy.
- **Rate limiting is Postgres-backed, not Redis-backed.** Chosen to avoid a hard dependency on an external service (some providers, like Upstash, aren't reliably reachable from every region). There's a small theoretical race window under very high concurrency; acceptable for the scale this template targets.
- **Email change is disabled for OAuth-only accounts.** Their `email` field only exists to mirror the linked provider's identity — allowing it to drift from that would be confusing rather than useful. Enable it once the account has its own password.
- **Linking a new OAuth provider only works if its email matches the account's current email.** A "connect any account regardless of email" flow is possible but requires a separate OAuth `connect` scope — out of scope for this template.

## License

MIT — do whatever you want with it.