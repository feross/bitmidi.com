import BaseModel from './model'
import objectionSlug from 'objection-slug'

const slug = objectionSlug({ sourceField: 'name' })

export default class Midi extends slug(BaseModel) {
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
      views: { type: 'number' }
    }
  }

  static virtualAttributes = ['url', 'downloadUrl']

  get url () {
    return `/${this.slug}`
  }

  get downloadUrl () {
    return `/uploads/${this.id}.mid`
  }
}
