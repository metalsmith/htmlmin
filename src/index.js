import { presets, minify as htmlmin } from 'html-minifier-next'
import { optimize as svgo } from 'svgo'
import { transform as lightningcss } from 'lightningcss'

/**
 * @typedef Options
 * @property {import('html-minifier-next').MinifierOptions} html
 * @property {import('lightningcss').TransformOptions} css
 * @property {import('svgo').Config} svg SVG manipulations can be configured via the `plugins` option, see https://svgo.dev/docs/preset-default/
 * @property {boolean|{ pattern: string}} json
 */

/** @type {Options} */
const defaults = {
  html: {
    ...presets.comprehensive,
    pattern: '**/*.html',
    conservativeCollapse: false,
    minifyJS: false,
    continueOnMinifyError: false,
    continueOnParseError: false
  },
  css: {
    pattern: '**/*.css'
  },
  svg: {
    pattern: '**/*.svg'
  },
  json: false
}

function toKb(bytes) {
  return Math.round(bytes / 1024)
}

/**
 * A Metalsmith plugin to serve as a boilerplate for other core plugins
 *
 * @param {Options} options
 * @returns {Options} options
 */
function normalizeOptions(options, isDev, debug) {
  options = options || {}
  const targets = ['html', 'css', 'svg', 'json']
  targets.forEach((ext) => {
    if (ext === 'json')
      options[ext] = !options[ext] ? false : { pattern: (options[ext] && options[ext].pattern) || '**/*.json' }
    else if (options[ext] !== false) {
      if (!options[ext] || options[ext] === true) options[ext] = { ...defaults[ext] }
    }
  })
  if (typeof options.html === 'string') {
    if (!minify.htmlPresets[options.html]) return new Error(options.html + ' preset not recognized')
    options.html = minify.htmlPresets[options.html]
  }
  /** @type {Options} */
  const normalized = {
    html: options.html === false ? false : { ...defaults.html, log: debug.info, ...options.html },
    css:
      options.css === false
        ? false
        : {
            ...defaults.css,
            minify: options.css.minify || !isDev,
            sourceMap: options.css.sourceMap || isDev,
            ...options.css
          },
    svg: options.svg === false ? false : { ...defaults.svg, ...options.svg },
    json: options.json === false ? false : options.json
  }
  return normalized
}

/**
 * A Metalsmith plugin to serve as a boilerplate for other core plugins
 *
 * @param {Options} options
 * @returns {import('metalsmith').Plugin}
 */
function minify(options) {
  return async function minify(files, metalsmith, done) {
    const isDev = metalsmith.env('NODE_ENV') === 'development'
    const debug = metalsmith.debug('@metalsmith/minify')

    if (options === false) {
      debug('Skipping minification.')
      done()
      return
    }

    options = normalizeOptions(options, isDev, debug)
    if (options instanceof Error) {
      debug('%O', options)
      debug.error('Error: %O', options)
      done(options)
      return
    }
    debug('Running with options: %O', options)

    const targets = ['svg', 'html', 'css', 'json'].reduce((dict, ext) => {
      if (options[ext] === false) dict[ext] = []
      else dict[ext] = metalsmith.match(options[ext].pattern).map((path) => [path, files[path]])
      return dict
    }, {})

    try {
      await Promise.all([
        options.html === false
          ? Promise.resolve()
          : body('html', targets.html, (src) => htmlmin(src, options.html), debug, files, metalsmith),
        options.svg === false
          ? Promise.resolve()
          : body('svg', targets.svg, (src) => Promise.resolve(svgo(src, options.svg).data), debug, files, metalsmith),
        options.css === false
          ? Promise.resolve()
          : body(
              'css',
              targets.css,
              (code, filename) => {
                const result = lightningcss({ ...options.css, filename, code })
                if (result.map) {
                  files[`${filename}.map`] = {
                    contents: Buffer.from(result.map),
                    stats: {
                      size: Buffer.byteLength(result.map, 'utf-8')
                    }
                  }
                }
                return Promise.resolve(result.code)
              },
              debug,
              files,
              metalsmith
            ),
        options.json === false
          ? Promise.resolve()
          : body('json', targets.json, (src) => JSON.stringify(JSON.parse(src)), debug, files, metalsmith)
      ])
      done()
    } catch (err) {
      debug.error('%O', err)
      done(err)
    }
    return
  }
}
// eslint-disable-next-line no-unused-vars
const { pattern, ...defaultHtmlPreset } = defaults.html
/**
 * @type {object<'conservative'|'comprehensive'|string, import('html-minifier-next').MinifierOptions>}
 */
minify.htmlPresets = { ...presets, default: defaultHtmlPreset }

async function body(name, targets, minify, debug, files, metalsmith) {
  const upper = name.toUpperCase()
  if (targets.length === 0) {
    debug('Skipping %s minification', upper)
    return
  }
  debug('Starting %s minification for %s file(s)', upper, targets.length)
  let oldSize = 0,
    newSize = 0
  const t1 = Date.now()

  await Promise.all(
    targets.map(async ([path, file]) => {
      const contents = file.contents.toString()
      oldSize += file.stats.size || Buffer.byteLength(contents, 'utf-8')
      let min
      try {
        min = await minify(file.contents.toString(), path)
      } catch (err) {
        const remapped = new Error(
          `Error while parsing/minifying ${upper} in ${metalsmith.path(metalsmith.source(), path)}`
        )
        remapped.cause = err
        debug.error(remapped)
        throw remapped
      }
      const minSize = Buffer.byteLength(min, 'utf-8')
      files[path].contents = Buffer.from(min, 'utf-8')
      files[path].stats.size = minSize
      newSize += minSize

      return [path, file]
    })
  )

  const timeSpent = (Date.now() - t1) / 1000
  debug('Finished minification for %s files in %s seconds.', targets.length, timeSpent)
  debug(
    'Minified %s %sKB -> %sKB (-%sKB/%s%)',
    upper,
    toKb(oldSize),
    toKb(newSize),
    toKb(oldSize - newSize),
    (100 - (oldSize / newSize) * 100).toFixed(1)
  )
}

export default minify
