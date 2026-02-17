# LIMIT - Building Regulation Compliance Platform

Professional SaaS platform for GDCR 2017 (Gujarat Development Control Regulations) compliance analysis in Gujarat/Ahmedabad.

## Overview

LIMIT helps architects, developers, and investors analyze building regulations for construction projects in Ahmedabad. The platform calculates FSI, height limits, setbacks, parking requirements, and other GDCR 2017 parameters automatically.

## Features

- **Project Management**: Create, view, edit, and delete building regulation projects
- **GDCR 2017 Compliance**: Automated calculation of all major regulatory parameters
- **Interactive Map Drawing**: Draw plot boundaries using Leaflet and Leaflet Draw
- **3D Visualization**: Interactive 3D building visualization
- **Professional PDF Reports**: Generate detailed PDF reports
- **Bulk Analysis**: Process multiple sites simultaneously
- **Comparative Analysis**: Compare multiple projects side-by-side
- **User Authentication**: Secure login/register with NextAuth v5

## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: NextAuth v5 with Prisma Adapter
- **Database**: Prisma ORM (SQLite dev / PostgreSQL production)
- **Maps**: Leaflet with React-Leaflet
- **Forms**: React Hook Form with Zod validation
- **PDF**: @react-pdf/renderer
- **Email**: React Email with Resend

## Project Structure

```
limit/
├── app/                    # Next.js App Router (pages, API routes)
├── components/             # UI components (ui, 3d, dashboard, forms, etc.)
├── lib/                    # Business logic (auth, calculations, regulations, db, etc.)
├── prisma/                 # Database schema and migrations
├── types/                  # TypeScript type definitions
├── auth.ts                 # NextAuth configuration
├── middleware.ts           # Route protection
└── package.json            # Dependencies
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone and install
git clone <repository-url>
cd limit
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
npx prisma generate
npx prisma migrate dev

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
# Required
DATABASE_URL="file:./dev.db"                    # SQLite for dev
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-with-openssl>"       # openssl rand -base64 32
JWT_SECRET="<generate-with-openssl>"

# Optional
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
RESEND_API_KEY=""
```

### Production Deployment

For Vercel:
1. Set environment variables in Vercel dashboard
2. Use PostgreSQL for `DATABASE_URL`
3. Deploy via GitHub or `vercel` CLI
4. Run `npx prisma migrate deploy`

## Usage

### Creating a Project
1. Click "New Project" from dashboard
2. Fill in site information (name, address, zone, authority)
3. Define plot dimensions:
   - Manual entry (length, width, area)
   - Interactive map drawing (recommended)
4. Enter road width(s) and special conditions
5. Click "Calculate Regulations"
6. View results and generate PDF report

### Key Calculations
- **FSI**: Base FSI, Premium FSI, corner plot bonus
- **Height**: Formula-based with zone limits
- **Setbacks**: Front, side, and rear setbacks
- **Ground Coverage**: Zone-specific percentages
- **Parking**: ECS calculation by use type
- **Fire Safety**: Height-based requirements
- **Accessibility**: Ramps and lift requirements

## Development

### Available Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # Run ESLint

npx prisma studio        # Database GUI
npx prisma migrate dev   # Create migration
npx prisma format        # Format schema
```

### Architecture

- **Authentication**: NextAuth v5 with JWT and Prisma
- **Database**: Prisma ORM with type-safe queries
- **API**: Next.js API routes with validation
- **Forms**: React Hook Form + Zod schemas
- **State**: React hooks and URL parameters

## GDCR 2017 Coverage

- Clause 7.2 - Floor Space Index
- Clause 7.3 - Building Height
- Clause 7.4 - Setback Requirements
- Clause 7.5 - Ground Coverage
- Clause 8.1 - Structural Requirements
- Clause 11.1 - Fire Safety Norms
- Clause 12.1 - Parking Norms
- Clause 13.1 - Accessibility Standards

## Supported Zones

- R1, R2 (Residential)
- Commercial
- Industrial
- Mixed-Use

## Authorities

- AUDA (Ahmedabad Urban Development Authority)
- AMC (Ahmedabad Municipal Corporation)

## Security

### Production Checklist
- [ ] Set secure `NEXTAUTH_SECRET` and `JWT_SECRET`
- [ ] Use PostgreSQL (not SQLite)
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Never commit secrets to git
- [ ] Run `npm audit` regularly

## Important Disclaimer

**This is an advisory tool only.** All calculations must be verified with local authorities (AUDA/AMC) before construction. No liability is assumed for decisions based on these reports. Always consult licensed professionals.

## Support

- **Technical Issues**: Check `docs/` folder or open GitHub issue
- **GDCR Compliance**: Consult AUDA/AMC or licensed architect
- **Documentation**: See `CLAUDE.md`, `UI_DESIGN_GUIDE.md`

---

**LIMIT Platform** - Building Regulation Compliance Made Simple

*Built with Next.js 16, TypeScript, Prisma, and NextAuth v5*
