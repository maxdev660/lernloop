import test from 'node:test';import assert from 'node:assert/strict';import {readFile,access} from 'node:fs/promises';import {join,resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../public');
test('PWA-Manifest: beide Installations-Icons, Standalone und Scope vorhanden',async()=>{
 const m=JSON.parse(await readFile(join(root,'manifest.webmanifest'),'utf8'));
 assert.equal(m.display,'standalone');assert.equal(m.start_url,'/');assert.equal(m.scope,'/');
 const sizes=new Set(m.icons.map(i=>i.sizes));assert.ok(sizes.has('192x192')&&sizes.has('512x512'));
 for(const ico of m.icons)await access(join(root,ico.src));
});
test('Offline-Shell: alle pre-cache Assets vorhanden, inklusive Kompass und Google-Verifizierung',async()=>{
 const sw=await readFile(join(root,'sw.js'),'utf8');
 assert.ok(sw.includes('lernloop-v6'));assert.ok(sw.includes('/js/core/compass.js'));
 const text=sw.match(/const ASSETS=\[([^\]]+)\]/)[1];
 const paths=[...text.matchAll(/'([^']+)'/g)].map(m=>m[1]);
 for(const path of paths){const file=path==='/'?'/index.html':path;await access(join(root,file));}
 await access(join(root,'google17f8e902f4d9cb04.html'));
 await access(join(root,'assets/brand/share-cover.png'));
});
