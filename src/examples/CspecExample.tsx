import React from 'react';
import { namedNode } from 'rdf-data-model';
import { GraphConsumer, GraphProvider, Vocabulary } from '..';
import i18n from '../i18n';

const endpoint = namedNode('http://data.crow.nl:8080/bibliotheekspecificatie/201711/');
const ontology = namedNode('http://ontologie.crow.nl/bibliotheekspecificatie/201711/');

export default () => (
  <div>
    <h1>{i18n.t('specificatieschema')}</h1>
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
