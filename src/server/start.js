// Server should be running as www-data by the time babel-register runs, since it
// reads/writes a .cache folder and it should be deleteable.
require('@babel/register')

const { init } = require('./index')

const port = Number(process.argv[2]) || 4000
init(port)
