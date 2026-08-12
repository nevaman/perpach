import {mkdir,rm,writeFile,copyFile,cp} from 'node:fs/promises';
import {join} from 'node:path';
import {pages} from '../src/content.mjs';

const pub = 'public';
await rm(join(pub,'mining','assets','site.css'),{force:true});
await rm(join(pub,'mining','assets','site.js'),{force:true});
['careers','company','contact','investor','newsroom','partnerships','privacy','projects','responsibility','terms','website-disclosures'].forEach(async d=>{await rm(join(pub,'mining',d,'index.html'),{force:true}).catch(()=>{})});
await rm(join(pub,'mining','projects','lunga','index.html'),{force:true}).catch(()=>{});
await rm(join(pub,'mining','index.html'),{force:true}).catch(()=>{});

const nav = [['Company','company'],['Projects','projects'],['Responsibility','responsibility'],['Investor','investor'],['Partnerships','partnerships'],['Newsroom','newsroom'],['Careers','careers'],['Contact','contact']];

const logoHeader = '/mining/assets/2026-08-13_Perpach-Metals-and-Mining_Horizontal_Supplied.png';
const logoIcon = '/mining/assets/PMM_LOGO_ICON-02.png';

function layout(p) {
  const links = nav.map(([n,u]) => `<a ${p.slug === u ? 'aria-current="page"' : ''} href="/mining/${u}">${n}</a>`).join('');
  const isHome = !p.slug;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${p.title} | Perpach Mining</title><meta name="description" content="${p.description}"><link rel="canonical" href="https://perpach.com/mining${p.slug ? '/' + p.slug : ''}"><link rel="icon" type="image/png" href="${logoIcon}"><link rel="stylesheet" href="/mining/assets/site.css"><script defer src="/mining/assets/site.js"></script></head><body><a class="skip" href="#content">Skip to content</a><header${isHome ? ' class="home-header"' : ''}><a class="brand" href="/mining" aria-label="Perpach Mining home"><img src="${logoHeader}" alt="Perpach Metals and Mining" height="42"></a><button class="menu" aria-expanded="false" aria-controls="nav">Menu</button><nav id="nav" aria-label="Primary">${links}</nav><a class="header-cta" href="/mining/projects/lunga">View Lunga <span>↗</span></a></header><main id="content">${p.body}</main><footer><div class="footer-lead"><div><span class="eyebrow">BUILDING WITH DISCIPLINE</span><h2>Grounded locally.<br>Built for the long term.</h2></div><a class="round" href="/mining/contact" aria-label="Contact Perpach">↗</a></div><div class="footer-grid"><div class="brand inverse"><img src="${logoHeader}" alt="Perpach Metals and Mining" height="28"><span><small></small></span></div><div><b>Explore</b><a href="/mining/company">Company</a><a href="/mining/projects">Projects</a><a href="/mining/investor">Investor partners</a></div><div><b>Connect</b><a href="/mining/careers">Careers</a><a href="/mining/contact">Contact</a><a href="/mining/newsroom">Newsroom</a></div><div><b>Legal</b><a href="/mining/privacy">Privacy</a><a href="/mining/terms">Terms</a><a href="/mining/website-disclosures">Disclosures</a></div></div><p class="fine">© 2026 Perpach. Site operator and licence-holder details are subject to legal confirmation. No information on this website constitutes an offer of securities.</p></footer></body></html>`;
}

const home = pages.find(p => p.slug === '');
await writeFile('index.html', layout(home));

await mkdir(join(pub, 'mining'), { recursive: true });
await writeFile(join(pub, 'mining', 'index.html'), layout(home));

for (const p of pages) {
  if (!p.slug) continue;
  const dir = join(pub, 'mining', p.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), layout(p));
}

await mkdir(join(pub, 'mining', 'assets'), { recursive: true });
await copyFile('src/site.css', join(pub, 'mining', 'assets', 'site.css'));
await copyFile('src/site.js', join(pub, 'mining', 'assets', 'site.js'));

// Also output dist for production
const out = 'dist';
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await writeFile(join(out, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/mining/"><title>Perpach Mining</title></head><body><script>window.location.replace('/mining/');</script></body></html>`);
await writeFile(join(out, '_redirects'), '/ /mining 307\n');
await writeFile(join(out, 'robots.txt'), 'User-agent: *\nAllow: /mining\nSitemap: https://perpach.com/sitemap.xml\n');
await writeFile(join(out, 'sitemap.xml'), `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p => `<url><loc>https://perpach.com/mining${p.slug ? '/' + p.slug : ''}</loc></url>`).join('')}</urlset>`);
for (const p of pages) {
  const dir = join(out, 'mining', p.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), layout(p));
}
await mkdir(join(out, 'mining', 'assets'), { recursive: true });
await copyFile('src/site.css', join(out, 'mining', 'assets', 'site.css'));
await copyFile('src/site.js', join(out, 'mining', 'assets', 'site.js'));
// Copy logo assets to dist
await cp(join(pub, 'mining', 'assets'), join(out, 'mining', 'assets'), { recursive: true });
