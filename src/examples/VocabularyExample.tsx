import React from 'react';
import { namedNode } from 'rdf-data-model';
import { GraphContext, Vocabulary } from '..';

const endpoint = 'https://bag.basisregistraties.overheid.nl/def/bag';
const ontologyIRI = namedNode('http://bag.basisregistraties.overheid.nl/def/bag');

export default () => (
  <div>
    <h1>Vocabulary</h1>
    <section className="mt-4">
      <GraphContext src={endpoint}>
        {store => (
          <Vocabulary store={store} ontology={ontologyIRI} />
        )}
      </GraphContext>
    </section>
  </div>
);
