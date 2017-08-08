# fs.futimes(fd, atime, mtime, callback)

<!-- YAML
added: v0.4.2
changes:
  - version: v7.0.0
    pr-url: https://github.com/nodejs/node/pull/7897
    description: The `callback` parameter is no longer optional. Not passing
                 it will emit a deprecation warning.
  - version: v4.1.0
    pr-url: https://github.com/nodejs/node/pull/2387
    description: Numeric strings, `NaN` and `Infinity` are now allowed
                 time specifiers.
-->

* `fd` {integer}
* `atime` {integer}
* `mtime` {integer}
* `callback` {Function}

Change the file timestamps of a file referenced by the supplied file
descriptor.

*Note*: This function does not work on AIX versions before 7.1, it will return
the error `UV_ENOSYS`.
