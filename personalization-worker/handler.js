import parser from 'accept-language-parser'

// TODO: this could go into KV
const dictionaries = {
  en: {
    latest: 'My latest',
    about: 'Me me me',
    blog: 'stories',
    talks: 'oss',
    mgr: 'leader',
    scalars: 'gql',
  },
  es: {
    latest: 'El ultimo',
    about: 'Yo yo yo',
    blog: 'historias',
    talks: 'oss',
    mgr: 'mgr',
    scalars: 'scalars',
  },
}

function getDictionary(request) {
  const languageHeader = request.headers.get('Accept-Language')
  const language = parser.pick(['en', 'es'], languageHeader, { loose: true })
  const dictionary = dictionaries[language] || {}
  return dictionary
}

class ElementHandler {
  constructor(dictionary) {
    this.dictionary = dictionary
  }
  element(element) {
    const i18nKey = element.getAttribute('data-i18n-key')
    if (i18nKey) {
      const translation = this.dictionary[i18nKey]
      if (translation) element.setInnerContent(translation)
    }
  }
}

/**
 * Respond with
 * @param {Request} request
 */
export async function handleRequest(request) {
  const dictionary = getDictionary(request)
  const crazy = something
  try {
    const site = await fetch('https://santiagoesteva.com')
    return new HTMLRewriter()
      .on('[data-i18n-key]', new ElementHandler(dictionary))
      .transform(site)
  } catch (error) {
    console.log(error.stack | error)
  }
}
