import { namedNode } from '@rdfjs/data-model';
import { Label, GraphContext } from '..';
import React from 'react';
import Resource from '../components/Resource';
import { Term } from 'rdf-js';

//const endpoint = 'https://standaarden.omgevingswet.overheid.nl/doc/20200719220257/waardelijst/Mijnbouwgroep_1.0.3';
const endpoint = 'https://run.mocky.io/v3/95c53f33-dc8b-42eb-9633-3eda26b7666c';
const resourceIri = namedNode('http://standaarden.omgevingswet.overheid.nl/id/waardelijst/Mijnbouwgroep_1.0.3');
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

const getPredicateLabel = (predicate: string, inverse: boolean) => {
  if (inverse) {
    return null;// `inverse of: ${predicate}`;
  }
  if (predicate.includes('purl') || predicate.includes('syntax')) {
    return null; // defer to default impl.
  }
  return predicate.toUpperCase(); // TODO no way to obtain the default mechanism
};

const prefixes = {
  cat: 'http://example.org/cat/'
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
            getPredicateLabel={getPredicateLabel}
            disableAutoLabel
            prefixes={prefixes}
          />
        </section>
      </div>
    )}
  </GraphContext>
);
