import BaseModel from './base-model'

export default class Midi extends BaseModel {
  static tableName = 'midis'

  static jsonSchema = {
    type: 'object',
    required: ['name', 'hash'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      hash: { type: 'string', minLength: 64, maxLength: 64 },
    }
  }
}
