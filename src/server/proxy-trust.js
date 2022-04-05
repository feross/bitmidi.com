import { isProd } from '../config'
import get from 'simple-get'

async function getCloudflareNetworks () {
  if (!isProd) return []

  const { success, result } = await (new Promise((resolve, reject) => {
    get.concat({
      url: 'https://api.cloudflare.com/client/v4/ips',
      json: true
    }, (err, res, body) => {
      if (err) return reject(err)
      resolve(body)
    })
  }))

  if (!success) {
    throw new Error('Failed to fetch cloudflare IP list')
  }

  return result.ipv4_cidrs.concat(result.ipv6_cidrs)
}

export async function getTrustedNetworks () {
  const cloudflareNetworks = await getCloudflareNetworks()

  return [
    'loopback',
    'uniquelocal' // Private IP ranges, including the nginx reverse proxy
  ].concat(cloudflareNetworks)
}
