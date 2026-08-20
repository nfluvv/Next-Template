# 🔐 Next.js Auth Template — FSD

A production-minded authentication starter built with **Next.js**, **Auth.js**, **Prisma**, **PostgreSQL**, and **Feature-Sliced Design (FSD)**.

A ready-to-use foundation for applications that need more than a simple login form: OAuth, email verification, password recovery, 2FA, profile management, administration, rate limiting, and security hardening are already implemented.

* 🚀 **[Live Demo](https://next-template-rho-six.vercel.app/en)**

---

### ✨ Features

- **Language Switching** — eng + ru.
- **Credentials Authentication** — email + password registration and login.
- **OAuth Authentication** — Google and GitHub providers.
- **Email Verification** — secure, single-use verification tokens with automatic login.
- **Password Recovery** — time-limited password reset flow.
- **Two-Factor Authentication** — RFC 6238 TOTP with QR setup and backup codes.
- **Profile Management** — username, display name, avatar, email and password management.
- **Cloudinary Uploads** — signed client-side avatar uploads.
- **Admin Panel** — user management, pagination, search, roles and audit logging.
- **Rate Limiting** — PostgreSQL-backed rate limiting without external infrastructure.
- **Account Linking** — secure OAuth account linking protected against account-takeover scenarios.
- **Session Validation** — user status is re-validated against the database.
- **Dark / Light / System Theme** — persistent theme support.
- **Responsive UI** — modern responsive interface built with shadcn/ui and Tailwind CSS.
- **FSD Architecture** — layer boundaries enforced with ESLint.

---

### 🖥️ Screenshots

#### Profile

![Profile](https://github.com/nfluvv/next-template/blob/main/public/screenshots/profile.PNG?raw=true)

#### Register

![Register](https://github.com/nfluvv/next-template/blob/main/public/screenshots/register.PNG?raw=true)

#### Settings

![Settings Security](https://github.com/nfluvv/next-template/blob/main/public/screenshots/settings2.PNG?raw=true)

#### Settings — Security

![Settings](https://github.com/nfluvv/next-template/blob/main/public/screenshots/settings.PNG?raw=true)

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

### 🚀 Installation

#### 1. Clone the repository

```bash
git clone https://github.com/nfluvv/next-template.git
cd next-template
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Configure environment variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Fill in the required environment variables, including your PostgreSQL connection, Auth.js secret, OAuth credentials, Cloudinary and Resend configuration.

#### 4. Set up the database

Make sure PostgreSQL is running and your `DATABASE_URL` is configured in `.env`.

Generate the Prisma Client:

```bash
npx prisma generate
```

Apply the database schema:

```bash
npx prisma migrate dev
```

If you need to inspect or manage the database manually, you can open Prisma Studio:

```bash
npx prisma studio
```

#### 5. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

#### Useful Prisma commands

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply a new migration
npx prisma migrate dev

# Apply migrations in production
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Reset the database
npx prisma migrate reset
```

> **Note:** `prisma migrate reset` deletes all data from the database. Use it only in development.

---

### 🏗️ Architecture & Codebase Structure

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
```
