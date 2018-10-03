import React from 'react';
import { namedNode } from 'rdf-data-model';
import { GraphConsumer, GraphProvider, Vocabulary } from '..';
import i18n from '../i18n';

const endpoint = namedNode('https://bag.basisregistraties.overheid.nl/def/bag');
const ontology = namedNode('http://bag.basisregistraties.overheid.nl/def/bag');

export default () => (
  <div>
    <h1> {i18n.t()} Basisregistratie Adressen en Gebouwen</h1>
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
