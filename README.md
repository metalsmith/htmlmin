# @metalsmith/minify

A metalsmith plugin to minify HTML,CSS,JSON, and SVG using [html-minifier-next](https://github.com/j9t/html-minifier-next), [lightningcss](https://github.com/parcel-bundler/lightningcss) and [svgo](https://github.com/svg/svgo)

[![metalsmith: core plugin][metalsmith-badge]][metalsmith-url]
[![npm: version][npm-badge]][npm-url]
[![ci: build][ci-badge]][ci-url]
[![code coverage][codecov-badge]][codecov-url]
[![license: MIT][license-badge]][license-url]

## Installation

NPM:

```
npm install @metalsmith/minify
```

Yarn:

```
yarn add @metalsmith/minify
```

## Usage

Pass `@metalsmith/minify` to `metalsmith.use` :

```js
import minify from '@metalsmith/minify'
const isDev = process.env.NODE_ENV === 'development'

metalsmith.use(minify()) // defaults
metalsmith.use(
  minify({
    // explicit defaults
    html: {
      ...minify.htmlPresets.comprehensive,
      pattern: '**/*.html',
      conservativeCollapse: false,
      minifyJS: false,
      continueOnMinifyError: false,
      continueOnParseError: false
      // log is set to @metalsmith/minify:info by default
    },
    css: {
      pattern: '**/*.css',
      minify: !isDev,
      sourceMap: isDev
    },
    json: false,
    svg: {
      pattern: '**/*.svg'
    }
  })
)
```

@metalsmith/minify minifies HTML only by ef

### Options

Optional section with list or table of options, if the plugin has a lot of options

### Specific usage example

Document a first specific usage example, the title can be "Achieve x by doing y"

### Specific usage example

Document a second specific usage example, the title can be "Achieve x by doing y"

### Debug

To enable debug logs, set the `DEBUG` environment variable to `@metalsmith/minify*`:

```js
metalsmith.env('DEBUG', '@metalsmith/minify*')
```

Alternatively you can set `DEBUG` to `@metalsmith/*` to debug all Metalsmith core plugins.

### CLI usage

To use this plugin with the Metalsmith CLI, add `@metalsmith/minify` to the `plugins` key in your `metalsmith.json` file:

```json
{
  "plugins": [
    {
      "@metalsmith/minify": {}
    }
  ]
}
```

## License

[MIT](LICENSE)

[npm-badge]: https://img.shields.io/npm/v/@metalsmith/minify.svg
[npm-url]: https://www.npmjs.com/package/@metalsmith/minify
[ci-badge]: https://github.com/metalsmith/minify/actions/workflows/test.yml/badge.svg
[ci-url]: https://github.com/metalsmith/minify/actions/workflows/test.yml
[metalsmith-badge]: https://img.shields.io/badge/metalsmith-core_plugin-green.svg?longCache=true
[metalsmith-url]: https://metalsmith.io
[codecov-badge]: https://img.shields.io/coveralls/github/metalsmith/minify
[codecov-url]: https://coveralls.io/github/metalsmith/minify
[license-badge]: https://img.shields.io/github/license/metalsmith/minify
[license-url]: LICENSE
