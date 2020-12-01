import { namedNode } from '@rdfjs/data-model';
import { Label, GraphContext } from '..';
import React from 'react';
import Resource from '../components/Resource';
import { Term } from 'rdf-js';

// const endpoint = 'https://standaarden.omgevingswet.overheid.nl/doc/20200719220257/waardelijst/Mijnbouwgroep_1.0.3';
const endpoint = 'https://run.mocky.io/v3/acb0c897-0199-4252-81a5-29078135eebb';
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

const formatPredicate = (predicate: string, inverse: boolean) => {
  if (inverse) {
    return null; // defer to default implementation
  }
  const owl = 'http://www.w3.org/2002/07/owl#';
  if (predicate.startsWith(owl)) {
    const name = predicate.substring(owl.length);
    return `${name} (OWL)`;
  }
  return null;
};

const prefixes = {
  cat: 'http://example.org/cat/',
  adms: 'http://www.w3.org/ns/adms#',
  owms: 'https://standaarden.overheid.nl/owms/terms/',
};

const includeProperty = (predicate: string, inverse: boolean) => {
  if (predicate.includes('sameAs') && !inverse) {
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
