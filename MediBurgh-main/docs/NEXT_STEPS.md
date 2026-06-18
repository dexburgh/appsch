# Next Steps After Installation

This guide captures the immediate tasks to complete once MediBurgh is installed locally. It
assumes you have already run `npm install` as part of the setup instructions in the README.

## 1. Validate the Platform Metadata
Run the Vitest suite to make sure every catalogued serverless function and release entry is
present and well-formed.

```bash
npm test
```

The tests confirm the `/api/catalog` response is synchronized with the UI audit surface and that
release metadata (version, commit hash, and deployment window) is current.

## 2. Smoke-Test the Build Output
Compile the production bundle so you know the project still ships successfully after making
changes.

```bash
npm run build
```

Resolve any warnings or errors before moving forward.

## 3. Launch the Development Server
Start Next.js in development mode to explore the experience. The landing page now includes a
Platform Audit section that lists every serverless endpoint and method.

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and confirm:
- The homepage renders without console errors.
- The Platform Audit grid shows all endpoints, methods, and release metadata.
- Navigating to `/api/catalog` returns the same catalog data powering the UI.

## 4. Plan Your Next Iteration
With the environment validated, pick the next backlog item. The high-level product roadmap lives
in the README. Translate an item into a concrete issue or task before writing additional code.

## 5. Document or Ship Changes
When you finish a change:
- Update relevant documentation (README, docs, or API descriptions).
- Run `npm test` and `npm run build` again.
- Commit using a descriptive message and open a PR summarizing the change and validations.

Following this checklist keeps the platform auditable, deployable, and ready for the next feature
push.
