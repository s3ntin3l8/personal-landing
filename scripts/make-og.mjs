// Generates public/og.png (1200x630). Run: node scripts/make-og.mjs
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="a" cx="20%" cy="25%" r="45%"><stop offset="0" stop-color="#0e9f6e" stop-opacity=".55"/><stop offset="1" stop-color="#0e9f6e" stop-opacity="0"/></radialGradient>
    <radialGradient id="b" cx="80%" cy="20%" r="45%"><stop offset="0" stop-color="#5e6ad2" stop-opacity=".6"/><stop offset="1" stop-color="#5e6ad2" stop-opacity="0"/></radialGradient>
    <radialGradient id="c" cx="70%" cy="90%" r="45%"><stop offset="0" stop-color="#d946ef" stop-opacity=".35"/><stop offset="1" stop-color="#d946ef" stop-opacity="0"/></radialGradient>
    <linearGradient id="t" x1="0" x2="1"><stop offset="0" stop-color="#34d399"/><stop offset=".5" stop-color="#818cf8"/><stop offset="1" stop-color="#e879f9"/></linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#000"/>
  <rect width="1200" height="630" fill="url(#a)"/><rect width="1200" height="630" fill="url(#b)"/><rect width="1200" height="630" fill="url(#c)"/>
  <text x="80" y="170" font-family="Helvetica, Arial, sans-serif" font-size="26" letter-spacing="6" fill="#86868b">BJÖRN HANSEN</text>
  <text x="80" y="300" font-family="Helvetica, Arial, sans-serif" font-size="88" font-weight="700" fill="#f5f5f7">Software I build</text>
  <text x="80" y="402" font-family="Helvetica, Arial, sans-serif" font-size="88" font-weight="700" fill="url(#t)">for my own stack.</text>
  <text x="80" y="520" font-family="Helvetica, Arial, sans-serif" font-size="32" fill="#86868b">Mullion · Pocket · Runway · branchDAM</text>
</svg>`;

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile('public/og.png');
