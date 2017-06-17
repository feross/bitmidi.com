# fs.utimes(path, atime, mtime, callback)

<!-- YAML
added: v0.4.2
changes:
  - version: v7.6.0
    pr-url: https://github.com/nodejs/node/pull/10739
    description: The `path` parameter can be a WHATWG `URL` object using `file:`
                 protocol. Support is currently still *experimental*.
  - version: v7.0.0
    pr-url: https://github.com/nodejs/node/pull/7897
    description: The `callback` parameter is no longer optional. Not passing
                 it will emit a deprecation warning.
  - version: v4.1.0
    pr-url: https://github.com/nodejs/node/pull/2387
    description: Numeric strings, `NaN` and `Infinity` are now allowed
                 time specifiers.
-->

* `path` {string|Buffer|URL}
* `atime` {integer}
* `mtime` {integer}
* `callback` {Function}

Change file timestamps of the file referenced by the supplied path.

*Note*: The arguments `atime` and `mtime` of the following related functions
follow these rules:

- The value should be a Unix timestamp in seconds. For example, `Date.now()`
  returns milliseconds, so it should be divided by 1000 before passing it in.
- If the value is a numeric string like `'123456789'`, the value will get
  converted to the corresponding number.
- If the value is `NaN`, `Infinity` or `-Infinity`, an Error will be thrown.
