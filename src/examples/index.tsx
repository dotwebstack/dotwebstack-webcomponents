import React from 'react';
import ReactDOM from 'react-dom';
import { Container } from 'reactstrap';
import { DataFactory, GraphContext, Label, Resource } from '..';

const dataFactory = new DataFactory();

const pand = dataFactory.namedNode(
  'http://bag.basisregistraties.overheid.nl/bag/id/pand/0003100000117485');

const pandGraph = dataFactory.namedNode(
  'http://bag.basisregistraties.overheid.nl/bag/doc/pand/0003100000117485');

const vocabularyGraph = dataFactory.namedNode('http://bag.basisregistraties.overheid.nl/def/bag');

const sources = [
  {
    url: 'https://bag.basisregistraties.overheid.nl/bag/doc/pand/0003100000117485',
    graph: pandGraph,
  },
  {
    url: 'https://bag.basisregistraties.overheid.nl/def/bag',
    graph: vocabularyGraph,
  },
];

const App = () => (
  <GraphContext src={sources}>
    <Container>
      <div className="page-header">
        <h1>
          <Label
            resource={pand}
            graph={pandGraph} />
        </h1>
      </div>
      <Resource
        iri={pand}
        graph={pandGraph}
        vocabularyGraph={vocabularyGraph}
        namespaces={['http://bag.basisregistraties.overheid.nl/def/bag#']} />
    </Container>
  </GraphContext>
);

ReactDOM.render(<App />, document.getElementById('root'));
