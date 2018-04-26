# DotWebStack Web Components

A set of embeddable Linked Data web components, built on React.

[![npm (scoped)](https://img.shields.io/npm/v/@dotwebstack/webcomponents.svg)](https://www.npmjs.com/package/@dotwebstack/webcomponents)

## Prerequisites

The following tools are required:

* [Node.js v8 or higher](https://nodejs.org/en/)

## Installation

These webcomponents can be installed using NPM:

```bash
npm install --save @dotwebstack/webcomponents
```

And of course, also with Yarn:

```bash
yarn add @dotwebstack/webcomponents
```

## Usage with React

Here is an example of using webcomponents within a React application:

```js
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DataFactory, GraphContext, GraphSource, PropertyTable } from '@dotwebstack/webcomponents';

const dataFactory = new DataFactory();

const App = () => (
  <GraphContext>
    <GraphSource url="https://bag.basisregistraties.overheid.nl/bag/doc/pand/0003100000117485" />
    <PropertyTable resource={dataFactory.namedNode('http://bag.basisregistraties.overheid.nl/bag/id/pand/0003100000117485')} />
  </GraphContext>
);

ReactDOM.render(<App />, document.getElementById('root'));
```

## Usage without React

Here is an example of using webcomponents in a non-React application:

```js
import { DataFactory, renderComponent } from '@dotwebstack/webcomponents';

// Alternative method when not using ES6 modules:
// const DataFactory = require('@dotwebstack/webcomponents').DataFactory;
// const renderComponent = require('@dotwebstack/webcomponents').renderComponent;

const dataFactory = new DataFactory();

renderComponent({
  name: 'GraphContext',
  children: [
    {
      name: 'GraphSource',
      props: {
        url: 'https://bag.basisregistraties.overheid.nl/bag/doc/pand/0003100000117485',
      },
    },
    {
      name: 'PropertyTable',
      props: {
        resource: dataFactory.namedNode('http://bag.basisregistraties.overheid.nl/bag/id/pand/0003100000117485'),
      },
    },
  ],
}, document.getElementById('root'));
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

When releasing a new version, manually increase the version number in `package.json` and commit/push this change.

Create & push Git tag (change version number):

```
git tag v0.0.3
git push origin v0.0.3
```

To publish the new version to the NPM registry:

```bash
npm publish
```

## License

This project is published under the [MIT License](LICENSE.md).
