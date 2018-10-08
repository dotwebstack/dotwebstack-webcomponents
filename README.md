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
npm install --save @dotwebstack/webcomponents @rdfjs/data-model
```

And of course, also with Yarn:

```bash
yarn add @dotwebstack/webcomponents @rdfjs/data-model
```

## Documentation

* [API Reference](./docs/api.md)

## Usage with React

Here is an example of using webcomponents within a React application:

```jsx
import React from 'react';
import { namedNode } from '@rdfjs/data-model';
import { GraphContext, Vocabulary } from '@dotwebstack/webcomponents';

const endpoint = 'https://bag.basisregistraties.overheid.nl/def/bag';
const ontologyIRI = namedNode('http://bag.basisregistraties.overheid.nl/def/bag')

const App = () => (
  <GraphContext src={endpoint}>
    {(store) => (
      <Vocabulary store={store} ontology={ontologyIRI} />
    )}
  </GraphContext>
);

ReactDOM.render(<App />, document.getElementById('root'));
```

## Usage without React

Here is an example of using webcomponents in a non-React application:

```js
import { namedNode } from '@rdfjs/data-model';
import { renderComponent } from '@dotwebstack/webcomponents';

// Alternative method when not using ES6 modules:
// const namedNode = require('@rdfjs/data-model').namedNode;
// const renderComponent = require('@dotwebstack/webcomponents').renderComponent;

const endpoint = 'https://bag.basisregistraties.overheid.nl/def/bag';
const ontologyIRI = namedNode('http://bag.basisregistraties.overheid.nl/def/bag')

graphContext(endpoint)
  .then((store) => {
    renderComponent(
      document.getElementById('root'),
      'Vocabulary',
      {
        store: store,
        iri: ontologyIRI,
      },
    );
  });
```

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
