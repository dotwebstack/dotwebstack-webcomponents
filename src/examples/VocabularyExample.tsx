import React from 'react';
import { namedNode } from '@rdfjs/data-model';
import { GraphContext, Vocabulary } from '..';

const endpoint = 'https://bag.basisregistraties.overheid.nl/def/bag';
const ontologyIRI = namedNode('http://bag.basisregistraties.overheid.nl/def/bag');
const link = 'ARE_U_STILL_UNDEFINED?';

export default () => (
  <div>
    <h1>Vocabulary</h1>
    <section className="mt-4">
      <GraphContext src={endpoint}>
        {store => (
          <Vocabulary
            store={store}
            ontology={ontologyIRI}
            linkbuilder={link}
          />
        )}
      </GraphContext>
    </section>
  </div>
);
