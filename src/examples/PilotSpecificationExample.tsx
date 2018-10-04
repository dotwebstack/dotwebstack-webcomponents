import React from 'react';
import { namedNode } from 'rdf-data-model';
import { Resource, GraphConsumer, GraphProvider } from '..';

const endpoint = namedNode('http://data.crow.nl:8080/specificaties/pilotdata/283394');
const resourceIri = namedNode('http://data.crow.nl/specificaties/pilotdata/283394');

export default () => (
  <div>
    <h1>Pilot Specificatie</h1>
    <section className="mt-4">
      <GraphProvider src={endpoint}>
        <GraphConsumer>
          {({ store }) => (
            <Resource store={store} resourceIri={resourceIri} />
          )}
        </GraphConsumer>
      </GraphProvider>
    </section>
  </div>
);
