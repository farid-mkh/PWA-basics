// cache api
const cacheHandler = () => {
  if (window.caches) {
    // to create cache db
    caches.open('pwa-v1.1').then((cache) => {
      // cache.add('/index.html')
      cache.addAll([
        './index.html',
        './main.js',
        './style.css'
      ])
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