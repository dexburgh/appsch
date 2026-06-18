import { serverlessCatalog } from '@/lib/serverlessCatalog';
import { getReleaseInfo } from '@/lib/releaseInfo';

const methodCoverage = serverlessCatalog.reduce(
  (accumulator, fn) => {
    accumulator.total += 1;
    fn.methods.forEach((method) => {
      accumulator.byMethod[method] = (accumulator.byMethod[method] ?? 0) + 1;
    });
    return accumulator;
  },
  { total: 0, byMethod: {} }
);

const stackHighlights = [
  { label: 'Framework', value: 'Next.js 13 App Router' },
  { label: 'UI Layer', value: 'React + Tailwind-ready design tokens' },
  { label: 'Data', value: 'Firebase (Auth, Firestore, Storage)' },
  { label: 'Deploy', value: 'Vercel with GitHub Actions CI' },
];

const featureBlueprint = [
  {
    title: 'Quick Quote Tool',
    summary: 'Generate CPT-based reimbursement estimates in seconds.',
    bullets: [
      'Inputs accept CPT code, modifiers, and unit counts.',
      'Exports to PDF, JSON, or clipboard with a single tap.',
      'Local history keeps timestamped quote cards for rapid recall.',
    ],
  },
  {
    title: 'Invoice Engine',
    summary: 'Flow from quote to invoice with dependable status tracking.',
    bullets: [
      'Draft, Sent, and Paid states with activity timeline.',
      'Manual line-item entry or auto-import from Quick Quote.',
      'Bundle PDFs or ZIP exports; optional Stripe payment links.',
    ],
  },
  {
    title: 'Admin Dashboard',
    summary: 'Operational cockpit for billing leads and auditors.',
    bullets: [
      'Searchable quote ledger with export receipts.',
      'Role-aware invoice approvals and reassignments.',
      'Download-ready audit trails and integration health checks.',
    ],
  },
  {
    title: 'Onboarding Flow',
    summary: 'Guided setup that reflects MediBurgh’s fortress identity.',
    bullets: [
      'Welcome tour covering Quick Quote in under two minutes.',
      'Brand preview with logo, palette, and typography tokens.',
      'Bulk CPT import via CSV with validation feedback.',
    ],
  },
];

const exportMatrix = [
  {
    title: 'PDF Layout',
    description:
      'Templated document featuring the MediBurgh lockup, tagline, and reimbursement summary with totals.',
  },
  {
    title: 'JSON Payload',
    description:
      'Structured quote object for downstream APIs and audit trails. Mirrors Firestore schema.',
  },
  {
    title: 'Clipboard Snippets',
    description: 'One-click copy for practitioners, formatted for EHR notes.',
  },
  {
    title: 'ZIP Bundles',
    description: 'Batch invoices, exports, and payment receipts for secure archival.',
  },
];

const qaSignals = [
  'Golden test runner validates CPT reimbursements against reference data.',
  'CLI debug mode simulates quotes with verbose logging and latency tracing.',
  'Jest + React Testing Library ensure resilient UI flows and utilities.',
  'GitHub Actions gate merges with lint, type-check, and unit coverage.',
];

const roleMatrix = [
  { role: 'Admin', scope: 'Full control across quotes, invoices, exports, and role management.' },
  { role: 'Practitioner', scope: 'Create quotes, convert to invoices, and monitor personal collections.' },
  { role: 'Viewer', scope: 'Read-only dashboards for finance partners and auditors.' },
];

const nextSteps = [
  'Polish wireframes for quote flow, dashboard, and onboarding moments.',
  'Implement export service with reusable PDF/JSON/clipboard generators.',
  'Scaffold onboarding walkthrough with progress persistence.',
  'Evaluate Stripe integration and webhook reconciliation.',
  'Add ZIP bundling to deployment pipeline for multi-invoice exports.',
];

export default function HomePage() {
  const { name: projectName, version: projectVersion, lastAudited } = getReleaseInfo();

  return (
    <>
      <section className="intro">
        <h2>Billing clarity for modern practices</h2>
        <p>
          MediBurgh transforms medical billing into a trusted, auditable workflow. The stack pairs
          a fortress-inspired brand with modular infrastructure so teams can quote, invoice, and
          reconcile without friction.
        </p>
        <ul className="stack">
          {stackHighlights.map((item) => (
            <li key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Feature architecture</h2>
        <div className="grid feature-grid">
          {featureBlueprint.map((feature) => (
            <article key={feature.title}>
              <header>
                <h3>{feature.title}</h3>
                <p>{feature.summary}</p>
              </header>
              <ul>
                {feature.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Export intelligence</h2>
        <div className="grid export-grid">
          {exportMatrix.map((option) => (
            <article key={option.title}>
              <h3>{option.title}</h3>
              <p>{option.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="callout">
        <h2>Quality signals</h2>
        <ul>
          {qaSignals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Serverless functions</h2>
        <p>
          Reference endpoints that demonstrate MediBurgh&apos;s approach to input validation, timeout handling, and
          observability-friendly responses across the platform.
        </p>
        <div className="grid function-grid">
          {serverlessCatalog.map((fn) => (
            <article key={fn.endpoint}>
              <header>
                <p className="function-name">{fn.name}</p>
                <div className="function-endpoint">
                  {fn.methods.map((method) => (
                    <span key={method} className="method-badge">
                      {method}
                    </span>
                  ))}
                  <code>{fn.endpoint}</code>
                </div>
              </header>
              <p>{fn.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Platform audit</h2>
        <p>
          Latest code review snapshot for <strong>{projectName}</strong>. Version metadata and method
          coverage help verify that every serverless function is surfaced to stakeholders.
        </p>
        <div className="grid audit-grid">
          <article>
            <h3>Release metadata</h3>
            <dl>
              <div>
                <dt>Package version</dt>
                <dd>{projectVersion}</dd>
              </div>
              <div>
                <dt>Functions catalogued</dt>
                <dd>{methodCoverage.total}</dd>
              </div>
              <div>
                <dt>Audit generated</dt>
                <dd>{new Date(lastAudited).toLocaleString()}</dd>
              </div>
            </dl>
          </article>
          <article>
            <h3>Method coverage</h3>
            <ul className="method-coverage">
              {Object.entries(methodCoverage.byMethod)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([method, count]) => (
                  <li key={method}>
                    <span>{method}</span>
                    <strong>{count}</strong>
                  </li>
                ))}
            </ul>
          </article>
        </div>
      </section>

      <section>
        <h2>Access model</h2>
        <p>
          Firebase Auth anchors the default email/password experience, while Clerk can extend SSO
          or passwordless flows. Roles tailor visibility and write-access per practitioner type.
        </p>
        <div className="grid role-grid">
          {roleMatrix.map((entry) => (
            <article key={entry.role}>
              <h3>{entry.role}</h3>
              <p>{entry.scope}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Deployment runway</h2>
        <p>
          GitHub Actions verify every pull request with lint, test, and build steps before Vercel
          promotes main. Notifications can be piped to Slack or email once the deployment locks in.
        </p>
        <ul className="next-steps">
          {nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
