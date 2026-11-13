// Service worker ขั้นต่ำ: ทำให้ Android แสดงปุ่ม "ติดตั้งแอป" และเปิดหน้าแรกได้แม้สัญญาณอ่อน
// ไม่เก็บข้อมูลพนักงานหรือข้อมูลร้านใด ๆ — เก็บแค่หน้าเปิดแอปและไอคอน
const CACHE = 'bph-shell-v2';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return; // LINE / Google ไม่ผ่าน cache
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
