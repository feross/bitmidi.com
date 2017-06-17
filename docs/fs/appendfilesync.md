# fs.appendFileSync(file, data[, options])

<!-- YAML
added: v0.6.7
changes:
  - version: v7.0.0
    pr-url: https://github.com/nodejs/node/pull/7831
    description: The passed `options` object will never be modified.
  - version: v5.0.0
    pr-url: https://github.com/nodejs/node/pull/3163
    description: The `file` parameter can be a file descriptor now.
-->

* `file` {string|Buffer|number} filename or file descriptor
* `data` {string|Buffer}
* `options` {Object|string}
  * `encoding` {string|null} default = `'utf8'`
  * `mode` {integer} default = `0o666`
  * `flag` {string} default = `'a'`

The synchronous version of [`fs.appendFile()`][]. Returns `undefined`.
