import React from 'react';
import { namedNode } from 'rdf-data-model';
import { GraphConsumer, GraphProvider, Vocabulary } from '..';

const endpoint = namedNode('http://localhost:8080/document/201711/');
const ontology = namedNode('http://ontologie.crow.nl/document/201711/');

export default () => (
  <div>
    <h1>Documentschema</h1>
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
