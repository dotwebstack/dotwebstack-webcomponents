import React from 'react';
import ReactDOM from 'react-dom';
import { Container } from 'reactstrap';
import { DataFactory, GraphContext, Label, Resource } from '..';

const dataFactory = new DataFactory();

const resource = dataFactory.namedNode(
  'http://bag.basisregistraties.overheid.nl/bag/id/ligplaats/0003020000000004');

const resourceGraph = dataFactory.namedNode(
  'http://bag.basisregistraties.overheid.nl/bag/doc/ligplaats/0003020000000004');

const vocabularyGraph = dataFactory.namedNode('http://bag.basisregistraties.overheid.nl/def/bag');

const sources = [
  {
    url: 'https://bag.basisregistraties.overheid.nl/bag/doc/ligplaats/0003020000000004',
    graph: resourceGraph,
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
            resource={resource}
            graph={resourceGraph} />
        </h1>
      </div>
      <section>
        <h2>Eigenschappen</h2>
        <Resource
          iri={resource}
          graph={resourceGraph}
          vocabularyGraph={vocabularyGraph}
          namespaces={['http://bag.basisregistraties.overheid.nl/def/bag#']} />
      </section>
    </Container>
  </GraphContext>
);

ReactDOM.render(<App />, document.getElementById('root'));
