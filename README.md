# 🔐 Next.js Auth Template — FSD

A production-minded authentication starter built with **Next.js**, **Auth.js**, **Prisma**, **PostgreSQL**, and **Feature-Sliced Design (FSD)**.

A ready-to-use foundation for applications that need more than a simple login form: OAuth, email verification, password recovery, 2FA, profile management, administration, rate limiting, and security hardening are already implemented.

---

### 🚀 Features

- **Credentials Authentication:** Email + password registration and login.
- **OAuth Authentication:** Google and GitHub providers.
- **Email Verification:** Secure, single-use verification tokens with automatic login.
- **Password Recovery:** Time-limited password reset flow.
- **Two-Factor Authentication:** RFC 6238 TOTP with QR setup and backup codes.
- **Profile Management:** Username, display name, avatar, email and password management.
- **Cloudinary Uploads:** Signed client-side avatar uploads.
- **Admin Panel:** User management, pagination, search, roles and audit logging.
- **Rate Limiting:** PostgreSQL-backed rate limiting without external infrastructure.
- **Account Linking:** Secure OAuth account linking protected against account-takeover scenarios.
- **Session Validation:** User status is re-validated against the database.
- **Dark / Light / System Theme:** Persistent theme support.
- **Responsive UI:** Modern responsive interface built with shadcn/ui and Tailwind CSS.
- **FSD Architecture:** Layer boundaries enforced with ESLint.

---

### 🖥️ Screenshots

#### Profile

![Profile](https://github.com/nfluvv/next-template/blob/main/public/screenshots/profile.PNG?raw=true)

#### Register

![Register](https://github.com/nfluvv/next-template/blob/main/public/screenshots/register.PNG?raw=true)

#### Settings

![Settings](https://github.com/nfluvv/next-template/blob/main/public/screenshots/settings.PNG?raw=true)

#### Settings — Security

![Settings Security](https://github.com/nfluvv/next-template/blob/main/public/screenshots/settings2.PNG?raw=true)

---

### 🛠 Tech Stack

- **Framework:** Next.js 16
- **UI:** React 19
- **Authentication:** Auth.js / NextAuth.js v5
- **Database:** PostgreSQL
- **ORM:** Prisma
- **State Management:** Zustand
- **Server State:** TanStack Query
- **Forms:** React Hook Form + Zod
- **UI Components:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS 4
- **Image Storage:** Cloudinary
- **Email:** Resend
- **2FA:** OTPAuth / TOTP
- **Testing:** Vitest
- **Architecture:** Feature-Sliced Design
- **CI:** GitHub Actions

---

### 🏗 Architecture & Codebase Structure

The project follows the **Feature-Sliced Design** methodology.

```text
src/
├── app/          # Application providers and global configuration
├── views/        # Page-level compositions
├── widgets/      # Complex reusable UI blocks
├── features/     # User interactions and business actions
├── entities/     # Domain models, schemas and queries
└── shared/       # UI kit, utilities and infrastructure

app/              # Next.js routing layer
