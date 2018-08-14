// TODO: publish to npm

import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'
import parseUrl from 'parseurl'
import rimraf from 'rimraf'
import send from 'send'
import { dirname, extname, join, normalize, relative, resolve, sep } from 'path'

const UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/

const IMAGEMIN_OPTS = {
  use: [
    imageminWebp({
      quality: 75,
      method: 6
    })
  ]
}

export default function serveWebp (root, opts = {}) {
  if (typeof root !== 'string') {
    throw new Error('Option `root` must be a string')
  }

  root = resolve(root)
  const cacheRoot = join(root, '.cache')

  rimraf.sync(cacheRoot)

  return (req, res, next) => {
    // decode the path
    let path = decode(parseUrl(req).pathname)
    if (path === -1) return next()

    // null byte(s)
    if (~path.indexOf('\0')) return next()

    // normalize
    if (path) path = normalize('.' + sep + path)

    // malicious path
    if (UP_PATH_REGEXP.test(path)) return next()

    // explode path parts
    const parts = path.split(sep)

    // dotfile
    if (containsDotFile(parts)) return next()

    // join / normalize from root dir
    path = normalize(join(root, path))

    const ext = extname(path)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.tif') {
      return next()
    }
    // attempt to serve from cache folder, if file exists
    const webpPath = relative(root, path).replace(/\.(png|jpg|tif)$/, '.webp')
    console.log(webpPath)
    send(req, webpPath, { root: cacheRoot })
      .on('error', async () => {
        try {
          const webpPath = await convertToWebp()
          send(req, webpPath, { root: cacheRoot }).pipe(res)
        } catch {
          return next()
        }
      })
      .pipe(res)

    async function convertToWebp () {
      const outputPath = join(cacheRoot, dirname(relative(root, path)))
      const [file] = await imagemin([path], outputPath, IMAGEMIN_OPTS)
      if (file == null) throw new Error(`No file with path "${path}"`)
      console.log('ran imagemin, output to ', file.path)
      return relative(cacheRoot, file.path)
    }
  }
}

function decode (path) {
  try {
    return decodeURIComponent(path)
  } catch (err) {
    return -1
  }
}

function containsDotFile (parts) {
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (part.length > 1 && part[0] === '.') {
      return true
    }
  }
  return false
}
