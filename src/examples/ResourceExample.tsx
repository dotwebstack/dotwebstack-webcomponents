import { namedNode } from '@rdfjs/data-model';
import { Label, GraphContext } from '..';
import React from 'react';
import Resource from '../components/Resource';
import { Term } from 'rdf-js';

const endpoint = 'https://bag.basisregistraties.overheid.nl/bag/doc/2011031800000000/pand/0200100000085932';
const resourceIri = namedNode('http://bag.basisregistraties.overheid.nl/bag/id/pand/0200100000085932');
const rows = [
  {
    predicate: namedNode('http://www.w3.org/2000/01/rdf-schema#isDefinedBy'),
    label: 'Is defined by',
  },
  {
    predicate: namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
    label: 'Label',
  },
  {
    predicate: namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
  },
  {
    predicate: namedNode('http://purl.org/dc/terms/subject'),
    label: 'Subject',
    customRender: (terms: Term[]) => {
      return <span>{terms.length}</span>;
    },
  },
  {
    predicate: namedNode('http://purl.org/dc/terms/extralabel'),
    label: 'Extra label',
  },
];

const formatPredicate = (predicate: string, inverse: boolean, shorten: (resource: string) => string) => {
  if (inverse) {
    return null; // defer to default implementation
  }
  const foaf = 'http://xmlns.com/foaf/0.1/';
  if (predicate.startsWith(foaf)) {
    const name = shorten(predicate); // use provided shortener
    return `${name} (foaf)`;
  }
  return null;
};

const prefixes = {
  bag: 'http://bag.basisregistraties.overheid.nl/def/bag#',
};

const includeProperty = (predicate: string, inverse: boolean) => {
  if (predicate.includes('status') && !inverse) {
    return false;
  }
  return true;
};

export default () => (
  <GraphContext src={endpoint}>
    {store => (
      <div>
        <h1><Label store={store} resourceIri={resourceIri} /></h1>
        <p>{resourceIri.value}</p>
        <section className="mt-4">
          <Resource
            store={store}
            resourceIri={resourceIri}
            rows={rows}
            hideEmptyProperties
            showAllProperties
            formatPredicate={formatPredicate}
            disableAutoLabel
            prefixes={prefixes}
            includeProperty={includeProperty}
            disableLegacyFormatting
          />
        </section>
      </div>
    )}
  </GraphContext>
);
