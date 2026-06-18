
# 🚀 MediBurgh Release Checklist (v1.0)
- Branding clean (`verify_brand.mjs`)
- `.env` filled from `.env.example`
- `node mediburgh_audit.mjs --ci` all green
- Lighthouse ≥ 90 (Perf/Acc/Best/SEO)
- Secrets clean, CSP/CORS/HTTPS verified
- CI green on `main`, deploy & smoke test
- Tag v1.0.0 + release notes
