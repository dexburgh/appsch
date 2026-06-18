#!/usr/bin/env node
import fs from 'fs'; import path from 'path';
const args=new Map();let last=null;for(const a of process.argv.slice(2)){if(a.startsWith('--')){last=a.slice(2);args.set(last,true);}else if(last){args.set(last,a);last=null;}}
const ROOT=args.get('path')||process.cwd();const SKIP=new Set(['node_modules','.git','.next','dist','build','.vercel','coverage','lighthouse']);
const PATTERNS=[/\banaesth(e|ae)aze\b/i,/\banesth(e|ae)ase\b/i,/\bvenmed\b/i,/\bvencorp\b/i,/\bctrl\s*panel\b/i,/\bburke\s*books?\b/i,/\bmediburg(h)?\b/i];
const ALLOW=/\bMediBurgh\b/;let hits=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(SKIP.has(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else{const ext=path.extname(p).toLowerCase();if(!['.ts','.tsx','.js','.jsx','.json','.md','.css','.scss','.html','.txt'].includes(ext))continue;const t=fs.readFileSync(p,'utf8');if(!ALLOW.test(t)||PATTERNS.some(rx=>rx.test(t))){for(const rx of PATTERNS){const m=t.match(rx);if(m)hits.push({file:path.relative(ROOT,p),match:m[0]});}}}}}
walk(ROOT);if(hits.length){console.log('Non-compliant brand references found:\n');for(const h of hits)console.log(` - ${h.file}: "${h.match}"`);process.exit(1);}else{console.log('✅ Brand references clean: only "MediBurgh" found.');}
