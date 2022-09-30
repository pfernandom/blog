export default function registerSW(navigator: Navigator, isProd: boolean) {
  navigator.serviceWorker.register('/sw.js').then(
    function (registration) {
      console.log(
        'Service Worker registration successful with scope: ',
        registration.scope
      )
      navigator.serviceWorker.controller?.postMessage({
        isProd,
      })

      registration.onupdatefound = function () {
        console.log('ServiceWorker update found.')
        // alert(
        //   'A new version is available - please close this browser tab or app window and re-open to update ... '
        // )
      }
    },
    function (err) {
      console.log('Service Worker registration failed: ', err)
    }
  )
}
