#!/usr/bin/env node
import fs from 'fs'; import path from 'path';
const args=new Map();let last=null;for(const a of process.argv.slice(2)){if(a.startsWith('--')){last=a.slice(2);args.set(last,true);}else if(last){args.set(last,a);last=null;}}
const ROOT=args.get('path')||process.cwd();const DRY=args.has('dry');
const LEGACY=[/anaesth(e|ae)aze/gi,/anesth(e|ae)ase/gi,/\bvenmed\b/gi,/\bvencorp\b/gi,/\bctrl\s*panel\b/gi,/\bburke\s*books?\b/gi,/\bmediburg(h)?\b/gi];
const SKIP=new Set(['node_modules','.git','.next','dist','build','.vercel','coverage','lighthouse']);
let filesTouched=0,replacements=0;
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(SKIP.has(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else{const ext=path.extname(p).toLowerCase();if(!['.ts','.tsx','.js','.jsx','.json','.md','.css','.scss','.html','.txt'].includes(ext))continue;let txt=fs.readFileSync(p,'utf8');const before=txt;txt=txt.replace(/\bmediburg(h)?\b/gi,'MediBurgh');for(const rx of LEGACY){if(rx.toString().includes('MediBurgh'))continue;txt=txt.replace(rx,'MediBurgh');}if(txt!==before){filesTouched+=1;replacements+=1;if(!DRY)fs.writeFileSync(p,txt,'utf8');console.log(`[BRAND] ${DRY?'(dry) ':''}${path.relative(ROOT,p)}`);}}}}
walk(ROOT);console.log(`\nDone. Files touched: ${filesTouched}, approx replacements: ${replacements}`);
