# MediBurgh Billing Platform

> Quote with confidence. Bill with clarity.

MediBurgh is a modular medical billing workspace built on Next.js and Firebase. The project pairs a
fortress-inspired brand system with pragmatic tooling so practices can generate quotes, send
invoices, and export airtight audit trails in minutes.

## Brand System
- **Palette:** Graphite-metallic foundations with scarlet accents (`#dc2626`).
- **Typography:** Inter (sans-serif) for interface copy; optional editorial serif for hero headings.
- **Logo lockup:** Fortress emblem with Open Graph/Twitter preview assets driven by
  `app/layout.js` metadata.

## Architecture at a Glance
| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 13 App Router | Hybrid rendering, file-based routing, React Server Components |
| Auth | Firebase Auth (email/password) | Optional Clerk integration for SSO or passwordless flows |
| Data | Firebase (Firestore, Storage) | Quote history, invoice records, export receipts |
| UI | React + Tailwind-ready tokens | Current styles live in `app/globals.css` |
| Testing | Jest + React Testing Library | Golden tests for CPT reimbursement logic |
| CI/CD | GitHub Actions + Vercel | Lint/test on PR, deploy on merge, optional Slack/email alerts |

## Feature Blueprint
### Quick Quote Tool (MVP)
- Accept CPT code, modifier, and unit inputs.
- Return estimated reimbursement instantly.
- Export to PDF, JSON, or clipboard; persist timestamped history locally.

### Invoice Engine
- Convert quotes into invoices or author manually.
- Track status from Draft → Sent → Paid with activity timelines.
- Export single PDFs or multi-invoice ZIP bundles; optionally attach Stripe payment links.

### Admin Dashboard
- Global quote and invoice search with export logs.
- Role-aware approvals and reassignment flows.
- Audit downloads and integration health monitoring.

### Onboarding Flow
- Welcome tour of the Quick Quote workflow.
- Branding preview with logo, palette, and typography tokens.
- Optional CSV importer for bulk CPT code registration.

## Export Intelligence
- **PDF:** MediBurgh-branded layout with logo, tagline, and reimbursement summary.
- **JSON:** Raw quote schema suitable for APIs and audit trails.
- **Clipboard:** One-click practitioner snippets for EHR notes.
- **ZIP:** Bundle invoices, exports, and payment receipts for archival delivery.

## Access & Roles
- **Admin:** Full control across quotes, invoices, exports, and role assignments.
- **Practitioner:** Create quotes, convert to invoices, and track personal receivables.
- **Viewer:** Read-only dashboards for finance partners or auditors.

## Quality Signals
- Golden test runner validates quote math against reference CPT datasets.
- CLI debug mode simulates quotes with verbose logging and latency tracing.
- Jest + React Testing Library guard UI flows and utility functions.
- GitHub Actions enforce lint, type-check, and test gates prior to deploy.
- `/api/catalog` returns the full serverless catalog plus version metadata for external audits.

## Getting Started
1. **Install prerequisites**
   - Node.js 18 or newer (mirrors the Vercel runtime).
   - npm 9+ (bundled with recent Node releases).
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment variables**
   - Copy `.env.example` to `.env.local` if you plan to wire Firebase or Stripe later.
   - No secrets are required for the static briefing site, but the file is respected by Next.js.
4. **Run the development server**
   ```bash
   npm run dev
   ```
   The site will be available at [http://localhost:3000](http://localhost:3000).
5. **Preview API routes (optional)**
   - Visit [http://localhost:3000/api/catalog](http://localhost:3000/api/catalog) to confirm the serverless catalog endpoint is live.

When the lint and test suites are wired up, run:
```bash
npm run lint
npm run test
```

## Deployment
1. Push changes to GitHub.
2. Open a pull request to trigger lint/test GitHub Actions workflows.
3. Merge to `main` to auto-deploy on Vercel.
4. Notifications can be piped to Slack or email via Vercel deploy hooks.

## Next Steps
For a hands-on checklist that walks through validation, builds, and shipping workflow, read
[docs/NEXT_STEPS.md](docs/NEXT_STEPS.md). When you're ready to tackle roadmap work, consider:

- Finalizing UI wireframes for quote flow, dashboards, and onboarding.
- Implementing the export service (PDF/JSON/clipboard) with shared generators.
- Building onboarding with progress persistence and optional Clerk handoff.
- Evaluating Stripe payment link integration and webhook reconciliation.
- Adding ZIP bundling into the deployment pipeline for multi-invoice exports.

---
Crafted for MediBurgh — fortifying revenue cycles with clarity and confidence.
