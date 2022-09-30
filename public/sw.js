;(() => {
  // src/sw/files.ts
  console.log('2022-09-28T05:19:25.567Z')
  var pages = []
  var files_default = pages

  // src/sw/sw.ts
  var sw = self
  sw.addEventListener('install', function (event) {
    sw.skipWaiting()
    event.waitUntil(addResourcesToCache([...files_default, 'favicon.ico']))
  })
  sw.addEventListener('fetch', (e) => {
    e.respondWith(cacheFirst(e.request))
  })
  sw.addEventListener('message', (event) => {
    if (!event.data.isProd) {
      caches.keys().then((keyList) => {
        //const cachesToDelete = keyList
        return Promise.all(keyList.map(deleteCache))
      })
    }
  })
  sw.addEventListener('activate', (event) => {
    event.waitUntil(deleteOldCaches())
  })
  var addResourcesToCache = async (resources) => {
    const cache = await caches.open('v1')
    await cache.addAll(resources)
  }
  var cacheFirst = async (request) => {
    try {
      const responseFromCache = await caches.match(request)
      if (responseFromCache) {
        return responseFromCache
      }
      const responseFromNetwork = await fetch(request)
      if (request.url.includes('opt_images', 'fonts', 'main.js', 'app.js')) {
        putInCache(request, responseFromNetwork.clone())
      }
      return responseFromNetwork
    } catch (err) {}
  }
  var putInCache = async (request, response) => {
    const cache = await caches.open('v1')
    await cache.put(request, response)
  }
  var deleteOldCaches = async () => {
    const cacheKeepList = ['v1']
    const keyList = await caches.keys()
    const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key))
    //const cachesToDelete = keyList
    await Promise.all(cachesToDelete.map(deleteCache))
  }
  var deleteCache = async (key) => {
    await caches.delete(key)
  }
})()
