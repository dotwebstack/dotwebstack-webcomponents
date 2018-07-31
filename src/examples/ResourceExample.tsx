import React from 'react';
import { namedNode } from 'rdf-data-model';
import { GraphConsumer, GraphProvider, Resource } from '..';

const resource = namedNode('http://bag.basisregistraties.overheid.nl/bag/id/ligplaats/0003020000000004');
const vocab = namedNode('https://bag.basisregistraties.overheid.nl/def/bag');

export default () => (
  <GraphProvider src={[resource, vocab]}>
    <section className="mt-4">
      <h2 className="mb-3">Eigenschappen</h2>
      <GraphConsumer>
        {({ store }) => (
          <Resource store={store} iri={resource} tableProps={{ striped: true }} />
        )}
      </GraphConsumer>
    </section>
  </GraphProvider>
);
