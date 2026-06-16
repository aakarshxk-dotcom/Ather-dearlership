const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, '..', 'node_modules', 'framer-motion', 'package.json');

try {
  if (!fs.existsSync(pkgPath)) {
    console.log('[patch] framer-motion not found, skipping');
    process.exit(0);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  if (!pkg.exports) {
    console.log('[patch] No exports field, skipping');
    process.exit(0);
  }

  let changed = false;
  for (const [key, exp] of Object.entries(pkg.exports)) {
    if (typeof exp === 'object' && exp !== null) {
      if (exp.import && exp.import.endsWith('.mjs')) {
        const cjsFile = exp.import.replace('.mjs', '.js').replace('/es/', '/cjs/');
        if (!fs.existsSync(path.join(__dirname, '..', 'node_modules', 'framer-motion', exp.import))) {
          exp.import = cjsFile;
          changed = true;
        }
      }
      if (exp.default && exp.default.endsWith('.mjs')) {
        const cjsFile = exp.default.replace('.mjs', '.js').replace('/es/', '/cjs/');
        if (!fs.existsSync(path.join(__dirname, '..', 'node_modules', 'framer-motion', exp.default))) {
          exp.default = cjsFile;
          changed = true;
        }
      }
    }
  }

  if (changed) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 4) + '\n');
    console.log('[patch] framer-motion exports fixed');
  } else {
    console.log('[patch] framer-motion exports OK');
  }
} catch (e) {
  console.log('[patch] Error:', e.message);
}
