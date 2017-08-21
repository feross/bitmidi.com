module.exports = highlight

const hljs = require('highlight.js')

function highlight (str, lang) {
  if (hljs.getLanguage(lang) == null) {
    throw new Error('"highlight" package missing JS support')
  }

  let html = ''
  try {
    html = hljs.highlight('js', str).value
    return `<pre class="hljs"><code>${html}</code></pre>`
  } catch (err) {
    // fallback to displaying nothing
  }
  return null
}
