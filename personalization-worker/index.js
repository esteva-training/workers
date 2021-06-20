import { handleRequest } from './handler'

addEventListener('fetch', event => {
  //if uncaught exception it will go to origin skipping the handler
  event.passThroughOnException()
  // it will skip this
  event.respondWith(handleRequest(event.request))
})
