# fs.writeFileSync(file, data[, options])

<!-- YAML
added: v0.1.29
changes:
  - version: v7.4.0
    pr-url: https://github.com/nodejs/node/pull/10382
    description: The `data` parameter can now be a `Uint8Array`.
  - version: v5.0.0
    pr-url: https://github.com/nodejs/node/pull/3163
    description: The `file` parameter can be a file descriptor now.
-->

* `file` {string|Buffer|integer} filename or file descriptor
* `data` {string|Buffer|Uint8Array}
* `options` {Object|string}
  * `encoding` {string|null} **Default:** `'utf8'`
  * `mode` {integer} **Default:** `0o666`
  * `flag` {string} **Default:** `'w'`

The synchronous version of [`fs.writeFile()`][]. Returns `undefined`.
