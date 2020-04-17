# DotWebStack Web Components

A set of embeddable Linked Data web components, built on React.

[![Build Status](https://travis-ci.org/dotwebstack/dotwebstack-webcomponents.svg?branch=master)](https://travis-ci.org/dotwebstack/dotwebstack-webcomponents)
[![NPM (Scoped)](https://img.shields.io/npm/v/@dotwebstack/webcomponents.svg)](https://www.npmjs.com/package/@dotwebstack/webcomponents)

## Prerequisites

The following tools are required:

* [Node.js v8 or higher](https://nodejs.org/en/)

## Installation

These webcomponents can be installed using NPM:

```bash
npm install --save @dotwebstack/webcomponents
```

## Documentation

* [API Reference](./docs/api.md)
* [Linked data Reference](./docs/linkedData.md)

## Usage

TODO

## Development

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run start
```

## Release

Make sure to switch to the `master` branch first.

Prepare a new version (change update type to `minor` or `major` when relevant):

```
npm version patch
```

Push commit & tag:

```
git push origin master --tags
```

To publish the new version to the NPM registry:

```bash
npm publish
```

## License

This project is published under the [MIT License](LICENSE.md).
