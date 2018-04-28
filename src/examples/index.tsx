import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DataFactory, GraphContext, PropertyTable } from '..';

const dataFactory = new DataFactory();

const sources = [
  {
    url: 'https://bag.basisregistraties.overheid.nl/def/bag',
    graph: dataFactory.namedNode(
      'http://bag.basisregistraties.overheid.nl/def/bag'),
  },
  {
    url: 'https://bag.basisregistraties.overheid.nl/bag/doc/pand/0003100000117485',
    graph: dataFactory.namedNode(
      'http://bag.basisregistraties.overheid.nl/bag/doc/pand/0003100000117485'),
  },
];

const App = () => (
  <GraphContext src={sources}>
    <PropertyTable
      resource={dataFactory.namedNode(
        'http://bag.basisregistraties.overheid.nl/bag/id/pand/0003100000117485')}
      graph={dataFactory.namedNode(
        'http://bag.basisregistraties.overheid.nl/bag/doc/pand/0003100000117485')}
      vocabularyGraph={dataFactory.namedNode(
        'http://bag.basisregistraties.overheid.nl/def/bag')}
      namespaces={['http://bag.basisregistraties.overheid.nl/def/bag#']} />
  </GraphContext>
);

ReactDOM.render(<App />, document.getElementById('root'));
