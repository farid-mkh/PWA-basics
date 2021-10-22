const CACHE_NAME = 'pwa-v1.0.0',
  STATIC_CACHES = ['/', '/css/style.css', 'main.js', 'github_icon.html']

console.log('✌ hello from sw.js');
// Service Worker 
// life cycle
self.addEventListener('install', (e) => {
  console.log('sw install event is running ...');
  /********* cache ******************************************************************/
  let cacheReady = caches.open(CACHE_NAME).then((cache) => {
    console.log('new cache is ready in sw');
    return cache.addAll(STATIC_CACHES)
  })
  /********* cache ******************************************************************/
  e.waitUntil(cacheReady)
  // waiting to install
  // let installPromise = new Promise((resolve) => {
  //   setTimeout(resolve, 1000);
  // })
  // e.waitUntil(installPromise)
  // 
})
self.addEventListener('activate', (e) => {
  console.log('sw activate event is running ...');
  /********* update cache and clean up old ones ******************************************************************/
  caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== CACHE_NAME) caches.delete(key)
    })
  })
})
// use to handle all fetch requests: all files requests and request in network
self.addEventListener('fetch', (e) => {
  // console.log('fetched data' + e.request.url);
  // if (e.request.url.endsWith('style.css')) {
  //   console.log(`sw fetch event: ${e.request.url}`);
  //   e.respondWith(fetch('./style.css'))
  // } else if (e.request.url.endsWith('/farid')) { // make resp for local:5500/farid
  //   let headers = new Headers({ 'Content-type': 'text/html' })
  //   let customRes = new Response(`<h1>Hello From Response</h1>`, { headers: headers })
  //   e.respondWith(customRes)
  // } else if (e.request.url.endsWith('/github_icon.html')) {
  //   console.log('adding github_icon.html to sw for offline purposes');
  //   e.respondWith(
  //     fetch(e.request)
  //       .then(res => {
  //         if (res.ok) return res
  //         // if not exist
  //         return new Response('github icon not found')
  //       })
  //   )
  // }
  /********* use cache ******************************************************************/
  if (!e.request.url.match(location.origin)) return;

  let newRes = caches.open(CACHE_NAME).then((cache) => {
    return cache.match(e.request).then((res) => {
      if (res) {
        console.log(`Serving ${res.url} from cache`);
        return res
      }
      return fetch(e.request).then((fetchedRes) => {
        cache.put(e.request, fetchedRes.clone())
        return fetchedRes
      })
    })
  })
  e.respondWith(newRes)

})
// message
self.addEventListener('message', (e) => {
  if (e.data === 'update_data') {
    console.log('SW is updating');
    self.skipWaiting()
  }
  // clients are multiple open windows
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      if (e.source.id === client.id) {
        client.postMessage('new_message')
      }
    })
  })
})
// server notif handler
self.addEventListener('push', (e) => {
  // let n = self.registeration.showNotification('A notif from the SW')
  // e.waitUntil(n)
})