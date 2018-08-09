import React from 'react';
import { namedNode } from 'rdf-data-model';
import { GraphConsumer, GraphProvider, Vocabulary } from '..';

const endpoint = namedNode('http://data.crow.nl:8080/imbor');
const ontology = namedNode('http://www.buildingbits.nl/coins2/draft/IMBOR.rdf');

export default () => (
  <div>
    <h1>IMBOR</h1>
    <section className="mt-4">
      <GraphProvider src={endpoint}>
        <GraphConsumer>
          {({ store }) => (
            <Vocabulary store={store} ontology={ontology} />
          )}
        </GraphConsumer>
      </GraphProvider>
    </section>
  </div>
);
