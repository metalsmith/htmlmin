# @metalsmith/htmlmin

A metalsmith plugin to minify html using [htmlnano](https://github.com/maltsev/htmlnano)

[![metalsmith: core plugin][metalsmith-badge]][metalsmith-url]
[![npm: version][npm-badge]][npm-url]
[![ci: build][ci-badge]][ci-url]
[![code coverage][codecov-badge]][codecov-url]
[![license: MIT][license-badge]][license-url]

## Features

An optional features section (if there are many), or an extended description of the core plugin

## Installation

NPM:

```
npm install @metalsmith/htmlmin
```

Yarn:

```
yarn add @metalsmith/htmlmin
```

## Usage

Pass `@metalsmith/htmlmin` to `metalsmith.use` :

```js
import htmlmin from '@metalsmith/htmlmin'

metalsmith.use(htmlmin()) // defaults
metalsmith.use(htmlmin({  // explicit defaults
  ...
}))
```

### Options

Optional section with list or table of options, if the plugin has a lot of options

### Specific usage example

Document a first specific usage example, the title can be "Achieve x by doing y"

### Specific usage example

Document a second specific usage example, the title can be "Achieve x by doing y"

### Debug

To enable debug logs, set the `DEBUG` environment variable to `@metalsmith/~core_plugin~*`:

```js
metalsmith.env('DEBUG', '@metalsmith/~core_plugin~*')
```

Alternatively you can set `DEBUG` to `@metalsmith/*` to debug all Metalsmith core plugins.

### CLI usage

To use this plugin with the Metalsmith CLI, add `@metalsmith/htmlmin` to the `plugins` key in your `metalsmith.json` file:

```json
{
  "plugins": [
    {
      "@metalsmith/htmlmin": {}
    }
  ]
}
```

## Credits (optional)

Special thanks to ... for ...

## License

[MIT](LICENSE)

[npm-badge]: https://img.shields.io/npm/v/@metalsmith/htmlmin.svg
[npm-url]: https://www.npmjs.com/package/@metalsmith/htmlmin
[ci-badge]: https://github.com/metalsmith/htmlmin/actions/workflows/test.yml/badge.svg
[ci-url]: https://github.com/metalsmith/htmlmin/actions/workflows/test.yml
[metalsmith-badge]: https://img.shields.io/badge/metalsmith-core_plugin-green.svg?longCache=true
[metalsmith-url]: https://metalsmith.io
[codecov-badge]: https://img.shields.io/coveralls/github/metalsmith/htmlmin
[codecov-url]: https://coveralls.io/github/metalsmith/htmlmin
[license-badge]: https://img.shields.io/github/license/metalsmith/htmlmin
[license-url]: LICENSE
