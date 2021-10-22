const CACHE_NAME = 'pwa-v1.0.0',
  STATIC_CACHES = ['/', '/css/style.css', 'main.js', 'github_icon.html']

// cache api
const cacheHandler = () => {
  if (window.caches) {
    // to create cache db
    caches.open(CACHE_NAME).then((cache) => {
      // cache.add('/index.html')
      cache.addAll(STATIC_CACHES)
      // cache.put('index.html',new Response('hello'))      // to edit
      cache.match('./index.html').then((res) => {
        // res.text().then(console.log)
      })
    })
    // caches.keys().then(console.log)                     // show all caches
    // caches.has('test').then(console.log)                // check 
    // caches.delete('test').then(console.log)             // delete 
  }
}
export { cacheHandler }