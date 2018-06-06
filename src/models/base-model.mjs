import Knex from 'knex'
import { Model } from 'objection'
import { join } from 'path'

import { db } from '../../secret'
import { rootPath } from '../../config'

const knex = Knex(db)

export default class BaseModel extends Model {
  // Lookup model names referenced in `relationMappings` in this folder
  static modelPaths = join(rootPath, 'src', 'models')

  // Set the status code to 404 when items are not found
  static createNotFoundError (queryContext) {
    const err = new this.NotFoundError()
    err.status = 404
    return err
  }
}

// Use this knex instance for all models
BaseModel.knex(knex)
