import React, { useEffect } from 'react'

export default function SwReload() {
  // @refresh reset
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        this.setTimeout(() => {
          navigator.serviceWorker.getRegistrations().then((registrations) => {
            for (const registration of registrations) {
              registration.unregister().then((bool) => {
                console.log('unregister: ', bool)
              })
            }
            window.location.reload()
          })
        })
      })
    }
  })

  return <></>
}
