# fs.symlinkSync(target, path[, type])

<!-- YAML
added: v0.1.31
changes:
  - version: v7.6.0
    pr-url: https://github.com/nodejs/node/pull/10739
    description: The `target` and `path` parameters can be WHATWG `URL` objects
                 using `file:` protocol. Support is currently still
                 *experimental*.
-->

* `target` {string|Buffer|URL}
* `path` {string|Buffer|URL}
* `type` {string} **Default:** `'file'`

Synchronous symlink(2). Returns `undefined`.
