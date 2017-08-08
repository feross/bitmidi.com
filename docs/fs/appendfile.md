# fs.appendFile(file, data[, options], callback)

<!-- YAML
added: v0.6.7
changes:
  - version: v7.0.0
    pr-url: https://github.com/nodejs/node/pull/7897
    description: The `callback` parameter is no longer optional. Not passing
                 it will emit a deprecation warning.
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
  * `encoding` {string|null} **Default:** `'utf8'`
  * `mode` {integer} **Default:** `0o666`
  * `flag` {string} **Default:** `'a'`
* `callback` {Function}

Asynchronously append data to a file, creating the file if it does not yet exist.
`data` can be a string or a buffer.

Example:

```js
fs.appendFile('message.txt', 'data to append', (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
```

If `options` is a string, then it specifies the encoding. Example:

```js
fs.appendFile('message.txt', 'data to append', 'utf8', callback);
```

Any specified file descriptor has to have been opened for appending.

*Note*: If a file descriptor is specified as the `file`, it will not be closed
automatically.
