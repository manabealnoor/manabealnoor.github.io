/* «حجوزات Yalla كورة» على الويب: الصفحة من النت وقت ما يكون فيه نت، والباقي محفوظ عشان تفتح من غير نت */
const C = 'yalla-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(K => Promise.all(K.filter(k => k.startsWith('yalla-') && k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || r.headers.has('range')) return;
  const page = r.mode === 'navigate' || /\.html$|\/$/.test(u.pathname);
  if (page) return e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(C).then(k => k.put(r, c)); return res; }).catch(() => caches.match(r).then(x => x || caches.match('./'))));
  e.respondWith(caches.match(r).then(x => x || fetch(r).then(res => { if (res.ok && res.status === 200) { const c = res.clone(); caches.open(C).then(k => k.put(r, c)); } return res; })));
});
