import BaseModel from './base-model'

export default class Midi extends BaseModel {
  static tableName = 'midis'

  static jsonSchema = {
    type: 'object',
    required: ['name'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1, maxLength: 255 }
    }
  }
}
