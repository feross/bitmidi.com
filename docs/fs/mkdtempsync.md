# fs.mkdtempSync(prefix[, options])

<!-- YAML
added: v5.10.0
-->

* `prefix` {string}
* `options` {string|Object}
  * `encoding` {string} **Default:** `'utf8'`

The synchronous version of [`fs.mkdtemp()`][]. Returns the created
folder path.

The optional `options` argument can be a string specifying an encoding, or an
object with an `encoding` property specifying the character encoding to use.
