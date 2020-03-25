// TODO: publish to npm

import Debug from 'debug'
import ImageminGm from 'imagemin-gm'
import ImageminWebp from 'imagemin-webp'
import imageSize from 'image-size'
import parseUrl from 'parseurl'
import send from 'send'
import { dirname, extname, join, normalize, relative, resolve, sep } from 'path'
import { promises as fs } from 'fs'
import { randomBytes } from 'crypto'
import { tmpdir } from 'os'

const { access, readFile, writeFile, mkdir } = fs
const debug = Debug('bitmidi:serve-webp')

const UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/

const convertWebp = ImageminWebp({
  method: 6,
  quality: 75
})

const convertWebpLow = ImageminWebp({
  method: 6,
  quality: 40
})

const resizeLow = (new ImageminGm()).resize({
  width: 960
})

export default function serveWebp (root, opts = {}) {
  if (typeof root !== 'string') {
    throw new Error('Option `root` must be a string')
  }

  root = resolve(root)

  // use a cache folder in /tmp, since that's guaranteed to be writable
  const cacheRoot = join(tmpdir(), randomBytes(16).toString('hex'))
  debug('Cache: %s', cacheRoot)

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

    const webpPath = path
    const relativeWebpPath = relative(root, webpPath)

    // request must end in .webp extname
    let ext = extname(path)
    if (ext !== '.webp') return next()

    // strip off .webp extname
    path = path.slice(0, -5)
    ext = extname(path)

    // is low-quality image requested?
    const isLow = ext === '.low'

    // strip off .low extname
    if (isLow) {
      path = path.slice(0, -4)
      ext = extname(path)
    }

    // ensure that file to convert is actually convertible to .webp
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.tif') return next()

    // attempt to serve webp file from cache folder
    send(req, relativeWebpPath, { root: cacheRoot })
      .once('error', async () => {
        // webp file was not in cache folder
        try {
          // ensure that original image file exists
          await access(path)
        } catch {
          // if original image file is missing, then skip running imagemin
          return next()
        }

        try {
          // convert original image file to webp and serve it
          await convertToWebp()
        } catch (err) {
          // if conversion to webp fails, return the error
          return next(err)
        }

        // once more, attempt to serve webp file from cache folder
        send(req, relativeWebpPath, { root: cacheRoot })
          .once('error', next)
          .pipe(res)
      })
      .pipe(res)

    async function convertToWebp () {
      let file = await readFile(path)
      if (isLow) {
        const { width } = imageSize(file)
        if (width > 960) {
          file = await resizeLow(file)
        }
        file = await convertWebpLow(file)
      } else {
        file = await convertWebp(file)
      }
      const outputPath = join(cacheRoot, relativeWebpPath)
      await mkdir(dirname(outputPath), { recursive: true })
      await writeFile(outputPath, file)
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
