import { namedNode } from '@rdfjs/data-model';
import { Label, GraphContext } from '..';
import React from 'react';
import Resource from '../components/Resource';
import { Term } from 'rdf-js';

const endpoint = 'https://bag.basisregistraties.overheid.nl/def/bag';
const resourceIri = namedNode('http://bag.basisregistraties.overheid.nl/def/bag#BAG-object');
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
    label: 'Type',
  },
  {
    predicate: namedNode('http://purl.org/dc/terms/subject'),
    label: 'Subject',
    customRender: (terms: Term[]) => {
      return (
        <ul className="list-unstyled mb-0">
          {terms.map(term => (
            <li key={term.value}><strong>{term.value}</strong></li>
          ))}
        </ul>
      );
    },
  },
  {
    predicate: namedNode('http://purl.org/dc/terms/extralabel'),
    label: 'Extra label',
  },
];

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
          />
        </section>
      </div>
    )}
  </GraphContext>
);
