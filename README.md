<h1 align="center">
  BitMidi
</h1>

<h4 align="center">
  🎹 Listen to free MIDI songs, download the best MIDI files, and share the
  best MIDIs on the web.
</h4>

<p align="center">
  <a href="https://travis-ci.org/feross/bitmidi.com"><img src="https://img.shields.io/travis/feross/bitmidi.com/master.svg" alt="travis"></a>
  <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide"></a>
</p>

<h3 align="center">
  <a href="https://bitmidi.com">bitmidi.com</a>
</h3>

## Usage

Visit the live site at **[bitmidi.com](https://bitmidi.com)**, the wayback machine for old-school MIDI files! Check out some examples here:

- [Backstreet Boys - I Want It That Way MIDI](https://bitmidi.com/backstreet-boys-i-want-it-that-way-mid)
- [Beethoven Moonlight Sonata MIDI](https://bitmidi.com/beethoven-moonlight-sonata-mid)
- [Camptown Races MIDI](https://bitmidi.com/camptown-mid)
- [Golden Sun - Overworld MIDI](https://bitmidi.com/golden-sun-overworld-mid)
- [Kingdom Hearts - Dearly Beloved MIDI](https://bitmidi.com/kingdom-hearts-dearly-beloved-mid)
- [Legend of Zelda - Overworld MIDI](https://bitmidi.com/legend-of-zelda-overworld-mid)
- [Michael Jackson - Billie Jean MIDI](https://bitmidi.com/michael-jackson-billie-jean-mid)
- [Michael Jackson - Don't Stop Till You Get Enough MIDI](https://bitmidi.com/michael-jackson-dont-stop-till-you-get-enough-mid)
- [Passenger - Let Her Go MIDI](https://bitmidi.com/passenger-let_her_go-mid)
- [Pokemon - Pokemon Center Theme MIDI](https://bitmidi.com/pokemon-pokemon-center-theme-mid)
- [Pokemon Red Blue Yellow - Opening MIDI](https://bitmidi.com/pokemon-redblueyellow-opening-yellow-mid)
- [Pokemon Red Blue Yellow - Wild Pokemon Battle MIDI](https://bitmidi.com/pokemon-redblueyellow-wild-pokemon-battle-mid)
- [Red Hot Chili Peppers - Californication MIDI](https://bitmidi.com/red-hot-chili-peppers-californication-mid)
- [Red Hot Chili Peppers - Otherside MIDI](https://bitmidi.com/red-hot-chili-peppers-otherside-mid)

## Contributing

It's easy to run the code!

### Clone the project and install the dependencies

```bash
git clone git@github.com:feross/bitmidi.com.git
cd bitmidi.com
npm install
```

### System Dependencies

- [GraphicsMagick](http://www.graphicsmagick.org/index.html)
  - Ubuntu: `sudo apt install graphicsmagick`
  - MacOS: `brew install graphicsmagick`
- `imagemin-webp > cwebp-bin`
  - Ubuntu: `sudo apt install libxi6 libglu1`
  - MacOS: n/a

### Setup Database

First, copy the sample secret file to a new file:

```bash
cp secret/index-sample.js secret/index.js
```

Second, run a local MySQL Server on port 3306 and create a database called `bitmidi.com`.

**Don't forget to change the credentials in `secret/index.js` to match what you
configured!** If you use a different MySQL version than what is specified, then
remember to change that, too. If you're running an older version of MySQL, you
may need to add a `insecureAuth: true` option under `db.connection`.

### Run Database Migrations

Once you complete the database setup, run the migrations:

```bash
npm run knex -- migrate:latest
```

### Mock local MIDI files

To load the site with MIDI files, you need to have a folder with MIDI files in
it. You can get a large collection
[here](https://www.reddit.com/r/WeAreTheMusicMakers/comments/3ajwe4/the_largest_midi_collection_on_the_internet/)
or some smaller ones [here](http://www.jsbach.net/midi/).

Then, in the project root, run this:

```bash
node -r @babel/register tools/import.js <path-to-folder-with-midis>
```

### Run the server

```bash
npm run build
npm start
```

### Watch and restart automatically:

```bash
npm run watch
```

## License

Copyright (c) [Feross Aboukhadijeh](https://feross.org)
