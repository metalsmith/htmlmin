import assert from 'node:assert'
import { resolve, dirname } from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import equals from 'assert-dir-equal'
import Metalsmith from 'metalsmith'
import plugin from '../src/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const { name } = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'))

function fixture(p) {
  return resolve(__dirname, 'fixtures', p)
}

function metalsmith(fixtureName) {
  return Metalsmith(fixture(fixtureName)).env('NODE_ENV', process.env.NODE_ENV).env('DEBUG', process.env.DEBUG)
}

describe('@metalsmith/minify', function () {
  it('should export a named plugin function matching package.json name', function () {
    const namechars = name.split('/')[1]
    const camelCased = namechars.split('').reduce((str, char, i) => {
      str += namechars[i - 1] === '-' ? char.toUpperCase() : char === '-' ? '' : char
      return str
    }, '')
    assert.strictEqual(plugin().name, camelCased.replace(/~/g, ''))
  })
  it('should not crash the metalsmith build when using default options', function (done) {
    metalsmith(fixture('default'))
      .use(plugin({ html: true, css: false, svg: false }))
      .build((err) => {
        if (err) done(err)
        try {
          assert.strictEqual(err, null)
          equals(fixture('default/build'), fixture('default/expected'))
          done()
        } catch (err) {
          done(err)
        }
      })
  })
  it('should handle parse/ minify errors', function (done) {
    metalsmith('parse-error')
      .use(plugin())
      .process((err) => {
        try {
          assert.notStrictEqual(err, null)
          assert.match(err.message, /^Error while parsing\/minifying/)
          done()
        } catch (err) {
          done(err)
        }
      })
  })
  describe('svg', function () {
    it('should parse svg', async function () {
      const ms = metalsmith('svg').use(plugin())
      await ms.build()
      equals(fixture('svg/build'), fixture('svg/expected'))
    })
  })

  describe('json', function () {
    it('should minify json', async function () {
      const ms = metalsmith('json').use(plugin({ json: true }))
      await ms.build()
      equals(fixture('json/build'), fixture('json/expected'))
    })
  })
})
