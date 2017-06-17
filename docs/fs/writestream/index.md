# Class: fs.WriteStream

<!-- YAML
added: v0.1.93
-->

`WriteStream` is a [Writable Stream][].

# Event: 'close'

<!-- YAML
added: v0.1.93
-->

Emitted when the `WriteStream`'s underlying file descriptor has been closed
using the `fs.close()` method.

# Event: 'open'

<!-- YAML
added: v0.1.93
-->

* `fd` {integer} Integer file descriptor used by the WriteStream.

Emitted when the WriteStream's file is opened.
