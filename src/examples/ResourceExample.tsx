import { namedNode } from '@rdfjs/data-model';
import GraphContext from '../components/GraphContext';
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
        <div>
          {terms.map(term => <h1>{term.value}</h1>)}
        </div>
      );
    },
  },
  {
    predicate: namedNode('http://purl.org/dc/terms/extralabel'),
    label: 'Extra label',
  },
];

export default () => (
  <div>
    <h1>Resource</h1>
    <section className="mt-4">
      <GraphContext src={endpoint}>
        {store => (
          <Resource store={store} resourceIri={resourceIri} rows={rows}/>
        )}
      </GraphContext>
    </section>
  </div>
);
