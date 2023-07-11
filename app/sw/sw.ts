/// <reference no-default-lib="true"/>
/// <reference lib="ES2015" />
/// <reference lib="webworker" />

// Default type of `self` is `WorkerGlobalScope & typeof globalThis`
// https://github.com/microsoft/TypeScript/issues/14877
const ctx = new self.ServiceWorkerGlobalScope()

// import files_default from './files'

ctx.addEventListener('install', function (event) {
  console.log('Hello world from the Service Worker \u{1F919}')
  ctx.skipWaiting()
  fetch('/api/hello')
    .then((data) => data.json())
    .then((data) => {
      console.log({ data })
    })
  event.waitUntil(addResourcesToCache(['favicon.ico']))
})

ctx.addEventListener('fetch', (e) => {
  console.log({ request: e.request })
  e.respondWith(cacheFirst(e.request))
})

ctx.addEventListener('activate', (event) => {
  console.log('Activated!!')
  event.waitUntil(deleteOldCaches())
})

ctx.addEventListener('message', (event) => {
  console.log(event.data.msg, event.data.url)
})

const addResourcesToCache = async (resources: Array<string>) => {
  const cache = await caches.open('v1')
  await cache.addAll(resources)
}
const cacheFirst = async (request: Request): Promise<Response> => {
  try {
    const responseFromCache = await caches.match(request)
    if (responseFromCache) {
      return responseFromCache
    }
    const responseFromNetwork = await fetch(request)
    if (request.url.includes('opt_images') || request.url.includes('fonts')) {
      putInCache(request, responseFromNetwork.clone())
    }
    return responseFromNetwork
  } catch (err) {
    console.error(err)
    return Promise.reject(err)
  }
}
const putInCache = async (request: Request, response: Response) => {
  const cache = await caches.open('v1')
  await cache.put(request, response)
}
const deleteOldCaches = async () => {
  const cacheKeepList = ['v2']
  const keyList = await caches.keys()
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key))
  await Promise.all(cachesToDelete.map(deleteCache))
}
const deleteCache = async (key: string) => {
  await caches.delete(key)
}
