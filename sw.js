/* Offline shell. Cache version bumped for new releases to avoid stale JS. */
const CACHE='lernloop-v4-20261116-a';
const ASSETS=['/','/index.html','/css/style.css','/assets/brand/mark.svg','/assets/icons/icon-192.png','/assets/icons/icon-512.png','/js/app.js','/js/core/engine.js','/js/core/storage.js','/js/core/calculator.js','/js/data/curriculum.js','/js/data/questions.js','/js/data/generators.js','/js/modules/math.js','/js/modules/languages.js','/manifest.webmanifest','/quellen.html'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(fetch(e.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});}return response;}).catch(()=>caches.match(e.request).then(x=>x||caches.match('/index.html'))));});
