
# MediBurgh — Everything Pack (Full)
1) `node MediBurgh-finish-pack/scripts/brand_sweep.mjs --path .`
2) `node MediBurgh-finish-pack/scripts/verify_brand.mjs --path .`
3) `node mediburgh_audit.mjs --init`
4) copy `.env.example` → `.env` and fill values
5) install dev deps:
   npm i -D typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin    eslint eslint-config-prettier eslint-plugin-import eslint-plugin-unused-imports    prettier vitest @vitest/coverage-v8 playwright @playwright/test @lhci/cli
6) run QA: `node mediburgh_audit.mjs --ci`
7) lighthouse: `node mediburgh_audit.mjs --url http://localhost:3000`
8) compare: `node mediburgh_audit.mjs --compare --urlA https://a --urlB https://b`
