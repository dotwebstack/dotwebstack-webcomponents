import React from 'react';
import { namedNode } from 'rdf-data-model';
import { ConceptList, GraphConsumer, GraphProvider } from '..';
import i18n from '../i18n';

const endpoint = namedNode('http://data.crow.nl:8080/thesaurus');

export default () => (
  <div>
    <h1>{i18n.t('thesaurus')}</h1>
    <section className="mt-4">
      <GraphProvider src={endpoint}>
        <GraphConsumer>
          {({ store }) => (
            <ConceptList store={store} />
          )}
        </GraphConsumer>
      </GraphProvider>
    </section>
  </div>
);
