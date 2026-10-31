const C='fx-v9',SHELL=['./','./index.html','./manifest.json','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
/* stale-while-revalidate: мгновенный запуск из кэша + тихое обновление в фоне */
const swr=rq=>caches.open(C).then(c=>c.match(rq,{ignoreSearch:true}).then(m=>{
  const net=fetch(rq).then(r=>{if(r.ok||r.type==='opaque')c.put(rq,r.clone());return r}).catch(()=>m);
  return m||net.then(r=>r||caches.match('./index.html'));
}));
self.addEventListener('fetch',e=>{
  const rq=e.request,u=new URL(rq.url);
  if(rq.method!=='GET')return;
  if(u.origin===location.origin||/flag/.test(u.href))e.respondWith(swr(rq));
});
