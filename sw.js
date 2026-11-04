'use strict';
/* Кэш сайта: страница — сначала из сети (чтобы обновления приходили сразу), файлы с версией и библиотеки — из кэша.
   Запросы каталога (Викитека, архивы, обложки) идут мимо кэша. Номер версии меняет deploy.sh. */
const CACHE = 'zakladka-1793784158';
const SHELL = ['./', 'index.html'];
const CDN = /^(cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/;

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => { }));
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const own = url.origin === self.location.origin;
  if (!own && !CDN.test(url.hostname)) return;
  // книги и манга из библиотеки и так сохраняются на полке — второй копии в кэше не нужно
  if (own && /\/library\/(books-|manga\/)/.test(url.pathname)) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put('index.html', c)); return r; }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === 'opaque') { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); }
    return r;
  })));
});
