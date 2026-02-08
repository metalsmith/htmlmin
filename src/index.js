/**
 * @typedef Options
 * @property {String} key
 */

/** @type {Options} */
const defaults = {
  key: 'key'
}

/**
 * Normalize plugin options
 * @param {Options} [options]
 * @returns {Object}
 */
function normalizeOptions(options) {
  return Object.assign({}, defaults, options || {})
}

function doSomething(file, path) {
  file.path = path
  return file
}

/**
 * A Metalsmith plugin to serve as a boilerplate for other core plugins
 *
 * @param {Options} options
 * @returns {import('metalsmith').Plugin}
 */
function htmlmin(options) {
  options = normalizeOptions(options)

  return function htmlmin(files, metalsmith, done) {
    const debug = metalsmith.debug('@metalsmith/htmlmin')
    debug('Running with options: %O', options)

    const fileList = Object.entries(files)

    fileList.forEach(([file, path]) => {
      if (file[options.key]) {
        doSomething(file, path)
      }
    })

    done()
  }
}

export default htmlmin
