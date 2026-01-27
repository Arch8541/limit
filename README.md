# LIMIT - Building Regulation Compliance Platform

Professional SaaS platform for GDCR 2017 (Gujarat Development Control Regulations) compliance analysis in Gujarat/Ahmedabad.

## Overview

LIMIT helps architects, developers, and investors quickly analyze building regulations for construction projects in Ahmedabad. The platform calculates FSI, height limits, setbacks, parking requirements, and other GDCR 2017 parameters automatically.

## Features

### Core Functionality
- **Project Management**: Create, view, edit, and delete building regulation projects
- **GDCR 2017 Compliance**: Automated calculation of all major regulatory parameters
- **Professional Reports**: Print-ready PDF reports with calculations and disclaimers
- **Bulk Analysis**: CSV template for processing multiple sites simultaneously
- **Search & Filter**: Quick search across all projects by name, address, or zone

### Calculations Provided
1. **FSI (Floor Space Index)**
   - Base FSI by zone
   - Premium FSI based on road width
   - Corner plot bonus
   - Maximum built-up area calculation

2. **Building Height**
   - Formula: 2 × (Road Width + Front Setback)
   - Zone-specific maximum limits
   - Transparent calculation display

3. **Setbacks**
   - Front setback (based on road width)
   - Side setback (based on building height)
   - Rear setback (zone-specific)

4. **Ground Coverage**
   - Maximum percentage by zone
   - Maximum ground floor area

5. **Parking Requirements**
   - ECS (Equivalent Car Space) calculation
   - Use-type specific requirements
   - Total area required

6. **Fire Safety**
   - Height-based requirements
   - Mandatory installations list

7. **Accessibility**
   - Ramp requirements
   - Lift requirements (height-based)
   - Universal access standards

8. **Structural Specifications**
   - Plinth height
   - Floor-to-floor height
   - Parapet specifications

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: JWT with bcryptjs
- **Storage**: localStorage (MVP)
- **Icons**: Lucide React
- **PDF Generation**: Browser print-to-PDF

## Project Structure

```
D:/limit/
├── app/                          # Next.js app router pages
│   ├── page.tsx                 # Landing page
│   ├── login/page.tsx           # Login page
│   ├── register/page.tsx        # Registration page
│   ├── dashboard/page.tsx       # Project list dashboard
│   ├── projects/
│   │   ├── new/page.tsx         # Project creation wizard
│   │   └── [id]/
│   │       ├── page.tsx         # Project detail view
│   │       └── report/page.tsx  # Printable PDF report
│   └── bulk-analysis/page.tsx   # CSV bulk upload
├── components/
│   └── ui/                      # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Badge.tsx
│       └── Tooltip.tsx
├── lib/
│   ├── auth/                    # Authentication utilities
│   ├── calculations/            # Regulation calculation engine
│   ├── regulations/             # GDCR 2017 rules database (JSON)
│   └── storage/                 # LocalStorage utilities
├── types/
│   └── index.ts                 # TypeScript type definitions
└── CLAUDE.md                    # Development tracking
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd limit

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### First Run

1. Navigate to `http://localhost:3000`
2. Click "Get Started" or "Register"
3. Create an account with email/password
4. Login to access the dashboard
5. Create your first project using "New Project"

## Usage Guide

### Creating a Project

1. Click "New Project" from dashboard
2. Fill in site information:
   - Project name and address
   - Location coordinates (lat/lng)
   - Authority (AUDA/AMC) and Zone
   - Plot dimensions (length × width)
   - Road width(s)
   - Intended use type
   - Special conditions (if any)
3. Click "Calculate Regulations"
4. View detailed results with calculations

### Viewing Reports

1. Open any completed project
2. Click "View Report"
3. Review all calculations and clauses
4. Click "Print / Save PDF" to generate PDF
5. Use browser's print dialog to save

### Bulk Analysis

1. Click "Bulk Analysis" from dashboard
2. Download CSV template
3. Fill in multiple site details
4. Upload completed CSV file
5. Process all sites simultaneously
6. Download comparative reports

## Important Disclaimers

**This is an advisory tool only.** All calculations and recommendations must be verified with the local development authority (AUDA/AMC) before proceeding with construction.

- No liability assumed for decisions based on reports
- Not a substitute for professional architectural/engineering consultation
- Regulations subject to amendments and updates
- Always verify current GDCR version applies

## Development

### Building
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Type Checking
TypeScript compilation happens automatically during build.

## GDCR 2017 Coverage

The platform implements regulations from:
- Clause 7.2 - Floor Space Index
- Clause 7.3 - Building Height
- Clause 7.4 - Setback Requirements
- Clause 7.5 - Ground Coverage
- Clause 8.1 - Structural Requirements
- Clause 11.1 - Fire Safety Norms
- Clause 12.1 - Parking Norms
- Clause 13.1 - Accessibility Standards

## Supported Zones

- **R1**: Residential Zone 1
- **R2**: Residential Zone 2
- **Commercial**: Commercial Zone
- **Industrial**: Industrial Zone
- **Mixed-Use**: Mixed-Use Development

## Authorities Supported

- **AUDA**: Ahmedabad Urban Development Authority
- **AMC**: Ahmedabad Municipal Corporation

## Future Enhancements

Potential features for future versions:
- Interactive map with plot visualization (Leaflet)
- Drawing file upload (DWG/PDF/JPG)
- AI-powered dimension extraction
- Real CSV parsing for bulk analysis
- Excel export with formulas
- Project comparison charts
- User collaboration/sharing
- Email notifications
- Multi-language support (Gujarati)

## License

This project is for educational and advisory purposes only.

## Contact

For questions or support regarding GDCR 2017 regulations, consult with:
- Local authority (AUDA/AMC)
- Licensed architect
- Structural engineer
- Legal advisor

---

**Generated by LIMIT Platform**
*Building Compliance Made Simple*
