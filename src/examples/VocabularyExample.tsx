import React from 'react';
import { namedNode } from 'rdf-data-model';
import { GraphConsumer, GraphProvider, Vocabulary } from '..';

const ontologyIri = namedNode('http://bag.basisregistraties.overheid.nl/def/bag');

export default () => (
  <div>
    <h1>Vocabulary</h1>
    <section className="mt-4">
      <GraphProvider src={ontologyIri}>
        <GraphConsumer>
          {({ store }) => (
            <Vocabulary store={store} ontologyIri={ontologyIri} />
          )}
        </GraphConsumer>
      </GraphProvider>
    </section>
  </div>
);
