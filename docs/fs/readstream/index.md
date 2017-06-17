# Class: fs.ReadStream

<!-- YAML
added: v0.1.93
-->

`ReadStream` is a [Readable Stream][].

# Event: 'close'

<!-- YAML
added: v0.1.93
-->

Emitted when the `ReadStream`'s underlying file descriptor has been closed
using the `fs.close()` method.

# Event: 'open'

<!-- YAML
added: v0.1.93
-->

* `fd` {integer} Integer file descriptor used by the ReadStream.

Emitted when the ReadStream's file is opened.
