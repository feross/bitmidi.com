# fs.readFileSync(path[, options])

<!-- YAML
added: v0.1.8
changes:
  - version: v7.6.0
    pr-url: https://github.com/nodejs/node/pull/10739
    description: The `path` parameter can be a WHATWG `URL` object using `file:`
                 protocol. Support is currently still *experimental*.
  - version: v5.0.0
    pr-url: https://github.com/nodejs/node/pull/3163
    description: The `path` parameter can be a file descriptor now.
-->

* `path` {string|Buffer|URL|integer} filename or file descriptor
* `options` {Object|string}
  * `encoding` {string|null} **Default:** `null`
  * `flag` {string} **Default:** `'r'`

Synchronous version of [`fs.readFile()`][]. Returns the contents of the `path`.

If the `encoding` option is specified then this function returns a
string. Otherwise it returns a buffer.

*Note*: Similar to [`fs.readFile()`][], when the path is a directory, the
behavior of `fs.readFileSync()` is platform-specific.

```js
// macOS, Linux and Windows
fs.readFileSync('<directory>');
// => [Error: EISDIR: illegal operation on a directory, read <directory>]

//  FreeBSD
fs.readFileSync('<directory>'); // => null, <data>
```
