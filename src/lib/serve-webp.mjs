// TODO: publish to npm

import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'
import parseUrl from 'parseurl'
import send from 'send'
import { dirname, extname, join, normalize, relative, resolve, sep } from 'path'
import { open } from 'fs'
import { promisify } from 'util'
import { randomBytes } from 'crypto'
import { tmpdir } from 'os'

const openAsync = promisify(open)

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

  // use a cache folder in /tmp, since that's guaranteed to be writable
  const cacheRoot = join(tmpdir(), randomBytes(16).toString('hex'))

  return async (req, res, next) => {
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

    // request must end in .webp extname
    let ext = extname(path)
    if (ext !== '.webp') return next()

    // strip off .webp extname
    path = path.replace(/\.webp$/, '')

    // ensure that file to convert is actually convertible to .webp
    ext = extname(path)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.tif') {
      return next()
    }

    // if path does not exist, abort before checking cache or running imagemin
    try {
      await openAsync(path, 'r')
    } catch {
      return next()
    }

    // attempt to serve from cache folder, if file exists
    const webpPath = relative(root, path).replace(/\.(png|jpg|tif)$/, '.webp')
    send(req, webpPath, { root: cacheRoot })
      .on('error', async () => {
        try {
          // if file is not in cache folder, convert to .webp and serve it
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
