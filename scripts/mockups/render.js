// Mockup SVGs -> PNGs with Vazirmatn (via @resvg/resvg-js).
// Usage: node render.js [svg-dir] [only-name]   (defaults: ./out, all)
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const DIR = process.argv[2] ? path.resolve(process.argv[2]) : path.join(HERE, 'out');
const only = process.argv[3];
const FONT_DIR = process.env.WOS_FONTS || path.join(HERE, '..', '..', 'node_modules', 'vazirmatn', 'fonts', 'ttf');
const FONTS = ['Regular', 'Medium', 'SemiBold', 'Bold', 'ExtraBold', 'Black']
  .map((w) => path.join(FONT_DIR, `Vazirmatn-${w}.ttf`));

for (const f of FONTS) {
  if (!fs.existsSync(f)) {
    console.error(`\n  ✗ Font missing: ${f}`);
    console.error('    Run: npm i --no-save vazirmatn @resvg/resvg-js\n');
    process.exit(1);
  }
}

const files = fs.readdirSync(DIR)
  .filter((f) => f.endsWith('.svg'))
  .filter((f) => !only || f === `${only}.svg`);

for (const f of files) {
  const svg = fs.readFileSync(path.join(DIR, f), 'utf8');
  // gallery phones @2x, hero @1x (already 1600px wide)
  const zoom = f === 'hero.svg' ? 1 : 2;
  const png = new Resvg(svg, {
    fitTo: { mode: 'zoom', value: zoom },
    font: { loadSystemFonts: false, fontFiles: FONTS },
  }).render().asPng();
  fs.writeFileSync(path.join(DIR, f.replace('.svg', '.png')), png);
  console.log('rendered', f, `${(png.length / 1024).toFixed(0)}KB`);
}
