# Class: fs.FSWatcher

<!-- YAML
added: v0.5.8
-->

Objects returned from [`fs.watch()`][] are of this type.

The `listener` callback provided to `fs.watch()` receives the returned FSWatcher's
`change` events.

The object itself emits these events:

# Event: 'change'

<!-- YAML
added: v0.5.8
-->

* `eventType` {string} The type of fs change
* `filename` {string|Buffer} The filename that changed (if relevant/available)

Emitted when something changes in a watched directory or file.
See more details in [`fs.watch()`][].

The `filename` argument may not be provided depending on operating system
support. If `filename` is provided, it will be provided as a `Buffer` if
`fs.watch()` is called with its `encoding` option set to `'buffer'`, otherwise
`filename` will be a string.

```js
// Example when handled through fs.watch listener
fs.watch('./tmp', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename)
    console.log(filename);
    // Prints: <Buffer ...>
});
```

# Event: 'error'

<!-- YAML
added: v0.5.8
-->

* `error` {Error}

Emitted when an error occurs.
