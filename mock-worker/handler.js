import { Router } from 'tiny-request-router'
import data from './mocks/data.json'
import { postError } from './logger'
import parser from 'accept-language-parser'

const respondWithJson = data =>
  new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json',
    },
  })

const mockedRouter = new Router()

mockedRouter.get('/ping', async () => new Response('mockedPong'))
mockedRouter.get(
  '/data',
  async () => new Response('someData will be returned instead'),
)
mockedRouter.get('/starwars', () => {
  return respondWithJson({
    height: 1,
    name: 'Pepe',
  })
})
const router = new Router()
router.get('/ping', async () => new Response('pong'))
router.get('/data', async () => respondWithJson(data))
router.get('/starwars', async () => {
  const request = new Request('https://swapi.dev/api/people/1/')
  const originalResponse = await fetch(request)
  const originalData = await originalResponse.json()
  const fake = doesNotExist
  const reducedData = {
    height: originalData.height,
    name: originalData.name,
  }
  return respondWithJson(reducedData)
})

const dictionary = {
  en: {
    latest: 'The latest',
    about: 'Me me me',
    blog: 'stories',
    talks: 'oss',
    mgr: 'mgr',
    scalars: 'scalars',
  },
  es: {
    latest: 'The latest',
    about: 'About',
    blog: 'blog',
    talks: 'oss',
    mgr: 'mgr',
    scalars: 'scalars',
  },
}

class ElementHandler {
  constructor(countryStrings) {
    this.countryStrings = countryStrings
  }

  element(element) {
    const i18nKey = element.getAttribute('data-i18n-key')
    console.log({ i18nKey })
    if (i18nKey) {
      const translation = this.countryStrings[i18nKey]
      console.log({ translation })
      if (translation) {
        element.setInnerContent(translation)
      }
    }
  }
}

router.get('/personalization', async (params, event) => {
  const languageHeader = event.request.headers.get('Accept-Language')
  const language = parser.pick(['en', 'es'], languageHeader)
  const countryStrings = dictionary[language] || {}
  try {
    const response = await fetch('https://santiagoesteva.com')
    const output = await new HTMLRewriter()
      .on('[data-i18n-key]', new ElementHandler(countryStrings))
      .transform(response)
    console.log('output', output.text())
    return output
  } catch (err) {
    console.log(err.stack || err)
  }
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
export async function handleRequest(event) {
  const { request } = event
  try {
    console.log(process.env.NODE_ENV)
    const { pathname } = new URL(request.url)
    const mocked = request.headers.get('mocked') === 'true' || false
    let match

    if (mocked) {
      match = mockedRouter.match(request.method, pathname)
    } else {
      match = router.match(request.method, pathname)
    }

    return match.handler(match.params, event)
  } catch (err) {
    event.waitUntil(postError(err.stack | err))

    return new Response('oops')
  }
}
