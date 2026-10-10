// pack-lint.mjs — 分发前口径检查(空白容忍正则版;词表经编码存储,分发物内不含被检实体名明文)
// 用法:node scripts/pack-lint.mjs <待检目录>
// 退出码:0=干净,1=有残留(逐条列出),2=用法错误。
import fs from 'node:fs';
import path from 'node:path';

const K = 'Ir0nC0rps-2026';
const dec = (b64) => {
  const raw = Buffer.from(b64, 'base64');
  const out = Buffer.alloc(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw[i] ^ K.charCodeAt(i % K.length);
  return out.toString('utf8');
};
const WORDS = dec('rui3TqaI73GWg7rWrq2h8rVvCnEzcZubt9eIka3Kmor+o3M8GkNZYFNCOx1cbxBZBhUkTEBUV1hIN1kJJl40HAZVM2ddRCIwRQonSXOZ6KzXq6zTzMExi+eXl+D/yLu915LVc9XK5NX+0JW6ktWiu0iVpcSrvPZxQhkHBwEEcUICWUJnQFCWpbTVvadIl47Ap4/TlcOi1Zi50/P9MUYIdCJZckldU0EZKABdATFJc5X7qtS9kNPM2tbzwNba0ZaRvTHXvs+Xv/9jZ0BxBR0cAzPS8fHU1PnUyvCXkKExYV89FxA5IkQRGHLLsovVjdaak+9CVx0eFE5aVVxRIQdRbwRfHBcwRVdeVV48Ew==').split(String.fromCharCode(1));
const RXS = dec('rui3MjAal8juFwjXlYahwqOJ6oqU0M/EsrPbtvFz2ffYbAFal5W5CgjR7sLY3tDV/eiXkKEx1azOLkNEpqHPSknKlYDahtqXv/anjeFxloO6bEEcr+6rMjAamvD2FwjWuq6u55WLxpyXzPzEsrPbtvFzeTIwGjMsAAdzCgjTwfTY2uXW2tGWkb3ZsrWg8ohvq4b3LAAH1YqVajpY1NbpbAFal5ChCgjf6MvX9e3V4v2arbHZso5Ilojup4jYLAAH14yn0Nr8bB1pfi4DWcmKmggMr/qoidaVl/XfyI6/27bKm7DWQlEHBBxAU0RbWSdfaw9uSkJdSnAZCgjTz/fZ7evY9dqWp5rVvqBpO3RvcglALF0cBAhuGHNI1ejG18/hlrGC1a+2SJqP6R9DWJX8oG5DGNHB3gpUpp/Llvm61LCV3uja2NHzMZf90nZxdH1rFQEKVKa295nwhdSsiNL16NXj4jEBG152cx1oV2QIAEN6bQlIDhcI16Snrc6Mi+y2m+LW').split(String.fromCharCode(1)).map(s => { const i = s.indexOf('::'); return [new RegExp(s.slice(0, i)), s.slice(i + 2)]; });

const dir = process.argv[2];
if (!dir || !fs.existsSync(dir)) { console.error('用法: node pack-lint.mjs <待检目录>'); process.exit(2); }

let fail = 0, files = 0;
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.md')) {
      files++;
      const t = fs.readFileSync(p, 'utf8');
      for (const w of WORDS) if (t.includes(w)) { console.log('残留(整词):', path.relative(dir, p), '→', w); fail++; }
      for (const [r, tag] of RXS) { const m = t.match(r); if (m) { console.log('残留(正则/' + tag + '):', path.relative(dir, p), '→', m[0]); fail++; } }
    }
  }
})(dir);
console.log(fail === 0 ? `PACK LINT PASS(${files} 个 md,整词 ${WORDS.length} + 正则 ${RXS.length} 零命中)` : `PACK LINT FAIL ${fail} 项`);
process.exit(fail ? 1 : 0);
