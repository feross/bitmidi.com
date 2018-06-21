import init from './index'

// TODO: Remove when upgrading to Node 10 because URL is global
import nodeUrl from 'url'
global.URL = nodeUrl.URL

const port = Number(process.argv[2]) || 4000
init(port)
