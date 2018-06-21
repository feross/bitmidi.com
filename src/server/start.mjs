import init from './index'

const port = Number(process.argv[2]) || 4000
init(port)
