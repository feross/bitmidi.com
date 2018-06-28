module.exports = objectionSlug

const mollusc = require('mollusc')
const uuid = require('uuid/v4')

const MOLLUSC_OPTS = {
  limit: 15, // limit slug to this many words
  charmap: { '.': '-', ...mollusc.charmap }
}

const MAX_SLUG_LENGTH = 75

function objectionSlug (opts) {
  opts = {
    sourceField: null,
    slugField: 'slug',
    ...opts
  }

  if (!opts.sourceField || !opts.slugField) {
    throw new Error('You must specify `sourceField` and `slugField`.')
  }

  return Model => {
    return class extends Model {
      async $beforeInsert (context) {
        await super.$beforeInsert(context)

        const source = this[opts.sourceField]
        if (!source) return

        const slug = await this.generateSlug(source)
        this[opts.slugField] = slug
      }

      async generateSlug (str) {
        let slug = mollusc(str, MOLLUSC_OPTS)

        // If slug has only unicode symbols without an English equivalent,
        // then slug will be empty, so use a UUID.
        if (slug.length === 0) {
          slug = uuid().replace(/-/g, '')
        }

        // Truncate excessively long slugs
        if (slug.length > MAX_SLUG_LENGTH) {
          slug = slug.slice(0, MAX_SLUG_LENGTH)
        }

        // Ensure that the slug is unique
        return this.generateUniqueSlug(slug)
      }

      async generateUniqueSlug (original, current = null, count = 0) {
        const isUnique = await this.isUnique(current || original)
        if (isUnique) return current || original

        count += 1

        return this.generateUniqueSlug(
          original,
          `${original}-${count}`,
          count
        )
      }

      async isUnique (slug) {
        const row = await this.constructor
          .query()
          .findOne(opts.slugField, slug)

        return !row
      }
    }
  }
}
