// TODO: publish to npm

import ImageminWebp from 'imagemin-webp'
import mkdirp from 'mkdirp'
import parseUrl from 'parseurl'
import send from 'send'
import { access, readFile, writeFile } from 'fs'
import { dirname, extname, join, normalize, relative, resolve, sep } from 'path'
import { promisify } from 'util'
import { randomBytes } from 'crypto'
import { tmpdir } from 'os'

const accessAsync = promisify(access)
const mkdirpAsync = promisify(mkdirp)
const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

const UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/

const convertWebp = ImageminWebp({
  method: 6,
  quality: 75
})

const convertWebpLow = ImageminWebp({
  method: 6,
  quality: 50
})

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
          await accessAsync(path)
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
      const file = await readFileAsync(path)
      const outputFile = isLow
        ? await convertWebpLow(file)
        : await convertWebp(file)
      const outputPath = join(cacheRoot, relativeWebpPath)
      await mkdirpAsync(dirname(outputPath))
      await writeFileAsync(outputPath, outputFile)
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
