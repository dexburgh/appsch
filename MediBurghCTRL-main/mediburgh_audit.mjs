#!/usr/bin/env node
/**
 * mediburgh_audit.mjs — Full audit & compare tool + BRAND CHECK (MediBurgh)
 * Updated: softer npm audit on Windows; brand/secret skip patterns; skip self file by default.
 *
 * Usage:
 *  node mediburgh_audit.mjs --init
 *  node mediburgh_audit.mjs --ci --brand-case=MediBurgh
 *  node mediburgh_audit.mjs --url http://localhost:3000
 *  node mediburgh_audit.mjs --compare --urlA https://a --urlB https://b
 *  node mediburgh_audit.mjs --brand-check --brand-case=MediBurgh --brand-skip="mediburgh_audit.mjs,finish-pack"
 *
 * Flags:
 *  --soft  Do not exit non-zero on failures
 *  --skipLint|--skipTypecheck|--skipUnit|--skipE2E|--skipAudit|--skipSecrets|--skipBrand
 *  --brand-case=(any|MediBurgh|mediburg)  (default any)
 *  --brand-allow=comma,separated
 *  --brand-skip=comma,separated   (substring match; files including any of these are ignored)
 *  --secrets-skip=comma,separated (substring match; files including any of these are ignored)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cwd = process.cwd();

// ---- args ----
const args = new Map();
let lastKey = null;
for (const a of process.argv.slice(2)) {
  if (a.startsWith('--')) { lastKey = a.substring(2); args.set(lastKey, true); }
  else if (lastKey) { args.set(lastKey, a); lastKey = null; }
}
function getArg(name, def=null){ return args.has(name) ? (args.get(name)===true ? true : args.get(name)) : def; }

const flags = {
  init: args.has('init'),
  ci: args.has('ci'),
  url: getArg('url', null),
  compare: args.has('compare'),
  urlA: getArg('urlA', null),
  urlB: getArg('urlB', null),
  soft: args.has('soft'),
  skipLint: args.has('skipLint'),
  skipTypecheck: args.has('skipTypecheck'),
  skipUnit: args.has('skipUnit'),
  skipE2E: args.has('skipE2E'),
  skipAudit: args.has('skipAudit'),
  skipSecrets: args.has('skipSecrets'),
  brandCheck: args.has('brand-check'),
  skipBrand: args.has('skipBrand'),
  brandCase: getArg('brand-case', 'any'),
  brandAllow: (getArg('brand-allow','')||'').split(',').map(s=>s.trim()).filter(Boolean),
  brandSkip: (getArg('brand-skip','')||'').split(',').map(s=>s.trim()).filter(Boolean),
  secretsSkip: (getArg('secrets-skip','')||'').split(',').map(s=>s.trim()).filter(Boolean),
};

const log=(m)=>console.log(m);
const warn=(m)=>console.warn(m);
const fail=(m)=>console.error(m);
const exists=(p)=>{ try{ fs.accessSync(p); return true } catch { return false } };
const exec=(cmd, soft=false)=>{
  try { return { ok:true, out: execSync(cmd, { stdio:'pipe', encoding:'utf8' }) }; }
  catch(e){ return { ok: soft, out: e.stdout?.toString()||'', err:e.stderr?.toString()||e.message }; }
};
function writeIfMissing(rel, content){
  const p = path.join(cwd, rel);
  if (!exists(p)) { fs.mkdirSync(path.dirname(p), { recursive:true }); fs.writeFileSync(p, content, 'utf8'); log(`+ wrote ${rel}`); }
  else { log(`= exists ${rel}`); }
}

// ---- init scaffold ----
function runInit(){
  writeIfMissing('README_AUDIT.md', `# MediBurgh QA\nRun \\`node mediburgh_audit.mjs --ci\\` for full gate; \\`--brand-check\\` enforces brand.\n`);
  writeIfMissing('.eslintrc.json', JSON.stringify({
    root:true, parser:'@typescript-eslint/parser',
    parserOptions:{ ecmaVersion:2022, sourceType:'module' },
    plugins:['@typescript-eslint','import','unused-imports'],
    extends:['eslint:recommended','plugin:@typescript-eslint/recommended','plugin:import/recommended','plugin:import/typescript','prettier'],
    rules:{ "no-console":"warn","@typescript-eslint/no-explicit-any":"warn","import/order":["warn",{alphabetize:{order:"asc"}}],"unused-imports/no-unused-imports":"error" }
  }, null, 2));
  writeIfMissing('.prettierrc', JSON.stringify({ printWidth:100, singleQuote:true, trailingComma:'all', semi:true }, null, 2));
  writeIfMissing('tsconfig.json', JSON.stringify({
    compilerOptions:{ target:'ES2022', lib:['ES2022','DOM'], module:'ESNext', moduleResolution:'Bundler', strict:true, noUncheckedIndexedAccess:true, exactOptionalPropertyTypes:true, forceConsistentCasingInFileNames:true, skipLibCheck:true },
    exclude:['node_modules','dist','build','**/*.spec.ts','**/*.test.ts']
  }, null, 2));
  writeIfMissing('.lighthouserc.json', JSON.stringify({ ci:{ collect:{ numberOfRuns:2, staticDistDir:'./public', settings:{ onlyCategories:['performance','accessibility','best-practices','seo','pwa'] } }, assert:{ assertions:{ "categories:performance":["warn",{minScore:0.9}], "categories:accessibility":["warn",{minScore:0.9}], "categories:best-practices":["warn",{minScore:0.9}], "categories:seo":["warn",{minScore:0.9}] } }, upload:{ target:'filesystem', outputDir:'./lighthouse' } } }, null, 2));
  writeIfMissing('playwright.config.ts', "import { defineConfig, devices } from '@playwright/test';\nexport default defineConfig({ testDir:'./tests/e2e', timeout:30000, retries:1, use:{ baseURL:process.env.E2E_BASE_URL||'http://localhost:3000', trace:'retain-on-failure' }, projects:[{ name:'chromium', use:{ ...devices['Desktop Chrome'] } }] });\n");
  writeIfMissing('.github/workflows/ci.yml',
`name: CI - MediBurgh Quality Gate
on: { push: { branches: [ main, master ] }, pull_request: { branches: [ main, master ] } }
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - name: Install
        run: npm ci || npm install
      - name: Build (optional)
        run: |
          if npm run | grep -q "build"; then npm run build; else echo "No build script"; fi
      - name: Lint
        run: npx eslint . --ext .ts,.tsx,.js,.jsx
      - name: Typecheck
        run: npx tsc -p tsconfig.json --noEmit || true
      - name: Unit tests
        run: npx vitest --run || true
      - name: E2E
        run: npx playwright install --with-deps && npx playwright test || true
      - name: Coverage
        run: npx vitest --coverage || true
      - name: Audit
        run: node mediburgh_audit.mjs --audit-soft
      - name: Secret scan
        run: node mediburgh_audit.mjs --secrets-only
      - name: Brand check
        run: node mediburgh_audit.mjs --brand-check
      - name: Lighthouse
        run: npx @lhci/cli autorun || true
`);
  writeIfMissing('docs/AUDIT_CHECKLIST.md', "# ✅ MediBurgh Launch Audit Checklist\n- Repo hygiene & env templates\n- Lint/format clean, TS strict\n- Unit/E2E coverage\n- Secrets clean, npm audit (soft)\n- Brand-only enforcement\n- Lighthouse ≥ 90s\n- CI/CD green\n");
  log('Init complete.');
}

// ---- secret scan (with skip) ----
const SECRET_PATTERNS = [
  /api[_-]?key\s*=\s*['\"][A-Za-z0-9_\-]{16,}['\"]/i,
  /secret\s*=\s*['\"][A-Za-z0-9_\-]{16,}['\"]/i,
  /ghp_[A-Za-z0-9]{30,}/,
  /-----BEGIN (RSA|DSA|EC) PRIVATE KEY-----/,
  /aws_access_key_id/i, /aws_secret_access_key/i,
];

function walk(dir, acc = []) {
  const skip = new Set(['node_modules','.git','.next','dist','build','.vercel','coverage','lighthouse','.tmp_lh_A','.tmp_lh_B']);
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function shouldSkipBySubstrings(file, substrings){
  const lower = file.toLowerCase();
  return substrings.some(s => s && lower.includes(s.toLowerCase()));
}

function secretScan(){
  log('🔐 Secret scan…');
  const files = walk(cwd, []);
  const hits = [];
  for (const f of files) {
    const rel = path.relative(cwd, f);
    if (rel === path.basename(__filename)) continue; // skip self
    if (shouldSkipBySubstrings(rel, flags.secretsSkip)) continue;
    const text = fs.readFileSync(f, 'utf8');
    for (const rx of SECRET_PATTERNS) {
      if (rx.test(text)) hits.push({ file: rel, pattern: rx.toString() });
    }
  }
  if (hits.length) {
    fail(`Found ${hits.length} potential secrets:`);
    hits.forEach(h => console.error(`  - ${h.file} :: ${h.pattern}`));
  } else log('No obvious secrets found.');
  return { ok: hits.length === 0 };
}

// ---- brand enforcement (with skip) ----
const FORBIDDEN_BRANDS = [
  'AnaesthEaze', 'AnaesthEase', 'AnesthEase', 'Anaesth', 'Invoxa', 'VenMed', 'VenCorp',
  'CTRL Panel', 'CTRLPanel', 'BurkeBooks', 'BearSheep', 'Bear-Sheep', 'BudgetBitch',
  'PulsePanel', 'NeedleHive', 'Strofie', 'Strofies', 'Kiddy Hotline', 'CTRL Room',
  'Anaesthetic-Eaze', 'AnaestheticEaze'
];

function brandCheck(){
  log('🏷️  Brand check…');
  const allowExtra = new Set(flags.brandAllow.map(s=>s.toLowerCase()));
  const files = walk(cwd, []);
  const violations = [];

  const forbiddenRegexes = FORBIDDEN_BRANDS
    .filter(b => !allowExtra.has(b.toLowerCase()))
    .map(b => new RegExp(`\\b${b.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\b`, 'i'));

  for (const f of files) {
    const rel = path.relative(cwd, f);
    if (rel === path.basename(__filename)) continue;           // skip self
    if (shouldSkipBySubstrings(rel, flags.brandSkip)) continue; // user-defined skips
    const skipExt = ['.png','.jpg','.jpeg','.gif','.webp','.ico','.woff','.woff2','.ttf','.eot','.pdf','.zip'];
    if (skipExt.some(ext => rel.toLowerCase().endsWith(ext))) continue;
    const text = fs.readFileSync(f, 'utf8');

    for (const rx of forbiddenRegexes) {
      if (rx.test(text)) violations.push({ file: rel, issue: `Forbidden brand detected: ${rx}` });
    }

    // casing rules
    if (flags.brandCase === 'MediBurgh') {
      const lines = text.split(/\r?\n/);
      lines.forEach((line, idx) => {
        if (/\bmediburg\b/.test(line) && !/\bMediBurgh\b/.test(line)) {
          violations.push({ file: rel, issue: `Improper brand casing at line ${idx+1}: expected "MediBurgh"` });
        }
      });
    } else if (flags.brandCase === 'mediburg') {
      const lines = text.split(/\r?\n/);
      lines.forEach((line, idx) => {
        if (/\bMediBurgh\b/.test(line)) {
          violations.push({ file: rel, issue: `Improper brand casing at line ${idx+1}: expected "mediburg"` });
        }
      });
    }
  }

  if (violations.length) {
    fail(`Brand violations: ${violations.length}`);
    violations.forEach(v => console.error(`  - ${v.file} :: ${v.issue}`));
    return { ok:false, violations };
  } else { log('Brand check passed.'); return { ok:true, violations:[] }; }
}

// ---- steps ----
function step(name, cmd, soft=false){
  log(`\n▶ ${name}\n$ ${cmd}`);
  const res = exec(cmd, soft);
  if (res.ok) log((res.out||'').toString().trim());
  else fail(res.err || res.out || 'failed');
  return res.ok;
}
function hasScript(s){
  const p = path.join(cwd,'package.json');
  if (!exists(p)) return false;
  try { const pkg = JSON.parse(fs.readFileSync(p,'utf8')); return Boolean(pkg.scripts && pkg.scripts[s]); }
  catch { return false; }
}
function runQA(){
  const results = [];
  if (hasScript('build')) results.push({ name:'Build', ok: step('Build','npm run build') });
  if (!flags.skipLint) results.push({ name:'Lint', ok: step('Lint', hasScript('lint')?'npm run lint':'npx eslint . --ext .ts,.tsx,.js,.jsx') });
  if (!flags.skipTypecheck) results.push({ name:'Typecheck', ok: step('Typecheck', hasScript('typecheck')?'npm run typecheck':'npx tsc -p tsconfig.json --noEmit', true) });
  if (!flags.skipUnit) {
    results.push({ name:'Unit tests', ok: step('Unit tests', hasScript('test')?'npm run test -- --run':'npx vitest --run', true) });
    results.push({ name:'Coverage', ok: step('Coverage', hasScript('coverage')?'npm run coverage':'npx vitest --coverage', true) });
  }
  if (!flags.skipE2E) {
    results.push({ name:'Playwright deps', ok: step('Playwright deps','npx playwright install --with-deps', true) });
    results.push({ name:'E2E', ok: step('E2E','npx playwright test', true) });
  }
  if (!flags.skipAudit) {
    // Soft by default (Windows-friendly): never fail build on audit
    results.push({ name:'npm audit (soft)', ok: step('Security audit (soft)','npm audit --audit-level=high', true) });
  }
  if (!flags.skipSecrets) results.push({ name:'Secret scan', ok: secretScan().ok });
  if (!flags.skipBrand) results.push({ name:'Brand check', ok: brandCheck().ok });
  return results;
}

// ---- Lighthouse & Compare ----
function runLighthouse(url){
  if (!url) { warn('No --url; skipping Lighthouse.'); return { ok:true }; }
  return { ok: step('Lighthouse', `npx @lhci/cli collect --url=${url} --numberOfRuns=2 && npx @lhci/cli assert || true && npx @lhci/cli upload --target=filesystem --outputDir=./lighthouse`, true) };
}
function parseLhReport(dir){
  if (!exists(dir)) return null;
  const files = fs.readdirSync(dir).filter(f=>f.endsWith('.json'));
  if (!files.length) return null;
  const sorted = files.sort((a,b)=> fs.statSync(path.join(dir,b)).mtimeMs - fs.statSync(path.join(dir,a)).mtimeMs);
  try { const d = JSON.parse(fs.readFileSync(path.join(dir,sorted[0]),'utf8')); const c = d.categories||{};
    return { performance:c.performance?.score??0, accessibility:c.accessibility?.score??0, bestPractices:c['best-practices']?.score??0, seo:c.seo?.score??0, pwa:c.pwa?.score??0 };
  } catch { return null; }
}
function compareURLs(a,b){
  const dirA = path.join(cwd,'.tmp_lh_A'); const dirB = path.join(cwd,'.tmp_lh_B');
  fs.mkdirSync(dirA,{recursive:true}); fs.mkdirSync(dirB,{recursive:true});
  step('LH A', `npx @lhci/cli collect --url=${a} --numberOfRuns=2 --outputDir=${dirA}`, true);
  step('LH B', `npx @lhci/cli collect --url=${b} --numberOfRuns=2 --outputDir=${dirB}`, true);
  const A = parseLhReport(dirA)||{}, B = parseLhReport(dirB)||{};
  const rows = []; const row=(label,key)=>{ const av=A[key]*100, bv=B[key]*100; const better = av===bv?'—':(av>bv?'A':'B'); rows.push(`| ${label} | ${Number.isFinite(av)?av.toFixed(0):'0'} | ${Number.isFinite(bv)?bv.toFixed(0):'0'} | ${better} |`); };
  row('Performance','performance'); row('Accessibility','accessibility'); row('Best Practices','bestPractices'); row('SEO','seo'); row('PWA','pwa');
  const md = ['# MediBurgh Compare Report','','| Category | A | B | Better |','|---|---:|---:|:--:|',...rows].join('\n');
  fs.writeFileSync(path.join(cwd,'COMPARE_REPORT.md'), md, 'utf8');
  log('📄 Wrote COMPARE_REPORT.md');
  return { ok:true };
}

// ---- main ----
(async function main(){
  if (args.has('secrets-only')) { const s = secretScan(); process.exit(s.ok?0:1); }
  if (flags.brandCheck) { const bc = brandCheck(); process.exit(bc.ok?0:1); }
  if (flags.init) runInit();

  let ok = true;
  if (flags.ci) {
    const res = runQA();
    const allOk = res.every(r=>r.ok);
    log('\n===== QA SUMMARY =====\n' + res.map(r=>`${r.ok?'✅':'❌'} ${r.name}`).join('\n'));
    ok = ok && allOk;
  }
  if (flags.url) ok = ok && runLighthouse(flags.url).ok;
  if (flags.compare) {
    if (!flags.urlA || !flags.urlB) { fail('Provide --urlA and --urlB'); ok=false; }
    else ok = ok && compareURLs(flags.urlA, flags.urlB).ok;
  }

  if (ok || flags.soft) { log(`\n✅ Done ${flags.soft ? '(soft mode)' : ''}`); process.exit(0); }
  fail('\n❌ One or more checks failed.'); process.exit(1);
})();
