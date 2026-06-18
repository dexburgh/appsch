import { readFileSync } from 'fs';
import path from 'path';

let cachedPackage = null;

function loadPackage() {
  if (cachedPackage) {
    return cachedPackage;
  }

  const packageJsonPath = path.join(process.cwd(), 'package.json');
  cachedPackage = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  return cachedPackage;
}

export function getReleaseInfo() {
  const pkg = loadPackage();

  return {
    name: pkg.name,
    version: pkg.version,
    lastAudited: new Date().toISOString(),
  };
}
