import Debug from 'debug'
import Knex from 'knex'
import { Model as ObjectionModel, knexSnakeCaseMappers } from 'objection'
import { join } from 'path'

import { db } from '../../secret'
import { rootPath } from '../../config'

const debug = Debug('bitmidi:model')

const knex = Knex({ ...db, ...knexSnakeCaseMappers() })

export default class Model extends ObjectionModel {
  // Lookup model names referenced in `relationMappings` in this folder
  static modelPaths = join(rootPath, 'src', 'models')

  // Add limit(1) to first() and getOne() queries
  static useLimitInFirst = true

  // Set the status code to 404 when items are not found
  static createNotFoundError (queryContext) {
    const err = new this.NotFoundError()
    err.status = 404
    return err
  }

  // Log raw SQL queries
  static query (...args) {
    return super.query(...args)
      .runAfter((models, query) => {
        debug(query.toString())
        return models
      })
  }

  $beforeInsert () {
    this.createdAt = new Date()
  }

  $beforeUpdate () {
    this.updatedAt = new Date()
  }
}

// Use this knex instance for all models
Model.knex(knex)
