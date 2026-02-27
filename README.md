# LIMIT - Building Regulation Compliance Platform

Professional SaaS platform for GDCR 2017 (Gujarat Development Control Regulations) compliance analysis.

## Features

- **GDCR 2017 Compliance**: Automated calculation of FSI, height limits, setbacks, parking, and more
- **Interactive Map**: Draw plot boundaries using Leaflet
- **PDF Reports**: Generate professional compliance reports
- **Project Management**: Create, edit, and manage multiple projects
- **User Authentication**: Secure login with NextAuth v5

## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript
- **Database**: Supabase PostgreSQL with Prisma ORM
- **Hosting**: AWS Amplify (Mumbai)
- **Auth**: NextAuth v5
- **Styling**: Tailwind CSS v4
- **Email**: Resend

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Local Development

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"

# Authentication
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="same-as-nextauth-secret"
AUTH_TRUST_HOST="true"

# Email (Optional)
RESEND_API_KEY=""
EMAIL_FROM="LIMIT <noreply@yourdomain.com>"
```

## Deployment

### AWS Amplify

The app is configured for AWS Amplify deployment:

1. Connect your GitHub repository to AWS Amplify
2. Set environment variables in Amplify Console:
   - `DATABASE_URL` - Supabase pooler connection string
   - `NEXTAUTH_SECRET` - Auth secret
   - `NEXTAUTH_URL` - Your Amplify app URL
   - `AUTH_SECRET` - Same as NEXTAUTH_SECRET
   - `AUTH_TRUST_HOST` - `true`
3. Deploy

Build configuration is in `amplify.yml`.

### Database (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Get connection string from Settings > Database
3. Use the **pooler** connection (port 6543) for serverless environments
4. Run migrations: `npx prisma migrate deploy`

## Project Structure

```
limit/
├── app/                # Next.js pages and API routes
├── components/         # React components
├── lib/                # Business logic and utilities
├── prisma/             # Database schema
├── types/              # TypeScript definitions
├── auth.ts             # NextAuth configuration
├── middleware.ts       # Route protection
└── amplify.yml         # AWS Amplify build config
```

## GDCR 2017 Coverage

| Clause | Description |
|--------|-------------|
| 7.2 | Floor Space Index (FSI) |
| 7.3 | Building Height |
| 7.4 | Setback Requirements |
| 7.5 | Ground Coverage |
| 11.1 | Fire Safety |
| 12.1 | Parking Norms |
| 13.1 | Accessibility |

**Supported Zones**: R1, R2, Commercial, Industrial, Mixed-Use
**Authorities**: AUDA, AMC

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint
npx prisma studio    # Database GUI
npx prisma migrate   # Run migrations
```

## Disclaimer

This is an advisory tool only. All calculations must be verified with local authorities (AUDA/AMC) before construction.

---

**LIMIT Platform** - Building Regulation Made Simple
