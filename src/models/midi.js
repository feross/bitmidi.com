import Model from './model'
import objectionSlug from 'objection-slug'

const slug = objectionSlug({ sourceField: 'name' })

export default class Midi extends slug(Model) {
  static tableName = 'midis'

  static jsonSchema = {
    type: 'object',
    required: ['name', 'hash'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      hash: { type: 'string', minLength: 64, maxLength: 64 },
      alternateNames: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
      views: { type: 'number' },
      plays: { type: 'number' },
      sharedTwitter: { type: 'boolean' },
      sharedReddit: { type: 'boolean' }
    }
  }

  static virtualAttributes = ['url', 'downloadUrl']

  get url () {
    return this.slug && `/${this.slug}`
  }

  get downloadUrl () {
    return this.id && `/uploads/${this.id}.mid`
  }
}
