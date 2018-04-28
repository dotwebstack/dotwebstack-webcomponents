import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DataFactory, GraphContext, GraphSource, PropertyTable } from '..';

const dataFactory = new DataFactory();

const App = () => (
  <GraphContext>
    <GraphSource
      url="https://bag.basisregistraties.overheid.nl/def/bag"
      graph={dataFactory.namedNode('http://bag.basisregistraties.overheid.nl/def/bag')} />
    <GraphSource
      url="https://bag.basisregistraties.overheid.nl/bag/doc/pand/0003100000117485"
      graph={dataFactory.namedNode(
        'https://bag.basisregistraties.overheid.nl/bag/doc/pand/0003100000117485')} />
    <PropertyTable
      resource={dataFactory.namedNode(
        'http://bag.basisregistraties.overheid.nl/bag/id/pand/0003100000117485')}
      graph={dataFactory.namedNode(
        'https://bag.basisregistraties.overheid.nl/bag/doc/pand/0003100000117485')}
      vocabularyGraph={dataFactory.namedNode(
        'http://bag.basisregistraties.overheid.nl/def/bag')}
      namespaces={['http://bag.basisregistraties.overheid.nl/def/bag#']} />
  </GraphContext>
);

ReactDOM.render(<App />, document.getElementById('root'));
