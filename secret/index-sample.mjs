const isProd = process.env.NODE_ENV === 'production'

export const cookie = {
  secret: 'TODO'
}

export const db = {
  client: 'mysql',
  version: '5.7',
  connection: {
    host: isProd ? 'TODO' : 'localhost',
    port: 3306,
    user: 'TODO',
    password: 'TODO',
    database: 'TODO'
  }
}

export const buffer = {
  accessToken: 'TODO',
  profileId: 'TODO'
}

export const rollbar = {
  accessToken: 'TODO'
}
