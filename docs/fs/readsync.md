# fs.readSync(fd, buffer, offset, length, position)

<!-- YAML
added: v0.1.21
changes:
  - version: v6.0.0
    pr-url: https://github.com/nodejs/node/pull/4518
    description: The `length` parameter can now be `0`.
-->

* `fd` {integer}
* `buffer` {string|Buffer|Uint8Array}
* `offset` {integer}
* `length` {integer}
* `position` {integer}

Synchronous version of [`fs.read()`][]. Returns the number of `bytesRead`.
