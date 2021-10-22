import { cacheHandler } from "./js/cache.js"
const urlBase64ToUnit8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArr = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArr[i] = rawData.charCodeAt(i)
  }
  return outputArr
}
// progressive enhancement (sw support)
if ('serviceWorker' in navigator) {
  // register the sw
  navigator.serviceWorker.register('./sw.js')
    // navigator.serviceWorker.register('./sw.js',{scope:'/posts'}) /* scope: to add sw to some directories */
    .then(function (registeration) {
      console.log('SW registered');
      /** updating *************************************************************/
      // it will be fired when sth has been changed in sw
      registeration.onupdatefound = () => {
        console.log('New On updaing');
        console.log('cache deleted');
        let newSW = registeration.installing
        newSW.onstatechange = () => {
          console.log('****' + newSW.state);
        }
        if (confirm('new Version found!! Do you want to update now?')) {
          caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)))
          newSW.postMessage('update_data') // use in message event
        }
      }
    })
  navigator.serviceWorker.addEventListener('message', (e) => {
    console.log(e.data);
  })
  // server notif handling
  // let publicKey = 'sth'
  // registeration.pushManager.getSubscrition().then((sub) => {
  //   if (sub) return sub

  //   let key = urlBase64ToUnit8Array(publicKey)
  //   registeration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key })
  // }).then((sub) => sub.toJSON())
  //   .then(console.log)
  //   .catch(console.log)
}
// Notification

if (window.Notification) {

  const showNotification = () => {
    console.log('notif is enabled!');
    let notifOption = {
      body: 'hello its notif',
      icon: 'https://img.icons8.com/color/48/000000/appointment-reminders--v3.png'
    }
    const newNotif = new Notification('new Notification', notifOption)
    newNotif.addEventListener('click', () => {
      console.log('notif clicked');
    })
  }

  if (Notification.permission === 'granted') {
    showNotification()
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission((permission) => {
      if (permission === 'granted') {
        showNotification()
      }
    })
  }

}

// Get github 
fetch('./github_icon.html')
  .then((res) => res.text())
  .then((html) => document.getElementById('camera').innerHTML = html)

// cache
cacheHandler()