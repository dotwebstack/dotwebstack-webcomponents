import React from 'react';
import TupleList, { Column } from '../components/TupleList';
import TupleSearch from '../components/TupleSearch';
import GraphSearch from '../components/GraphSearch';
import { Resource } from '..';
import { namedNode } from '@rdfjs/data-model';
import { Term } from 'rdf-js';

const tupleEndpoint = 'https://catalogus.kadaster.nl/concepten?term=';
const graphEndpoint = 'https://catalogus.kadaster.nl/resource?subject=';
const resourceIri = namedNode('http://wetgeving.omgevingswet.overheid.nl/id/concept/Autoweg');

const columns: Column[] = [
  {
    name: 'resource_label',
    label: 'Label',
  },
  {
    name: 'resource',
    label: 'Begrip',
    sortable: true,
  },
  {
    name: 'uitleg',
    label: 'Definitie',
  },
];

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

const tupleChild = (result: any) => (
  <TupleList
            result={result}
            columns={columns}
            pageSize={10}/>
);

const graphChild = (store: any) => (
  <Resource resourceIri={resourceIri} store={store} rows={rows} />
);

export default () => (
  <div>
    <h1>Searching</h1>
    <section className="mt-4">
    Tuple search
      <TupleSearch endpoint={tupleEndpoint} columns={columns} children={tupleChild}/>
    </section>
    <section className="mt-4">
    Graph Search
      <GraphSearch endpoint={graphEndpoint} children={graphChild}/>
    </section>
  </div>
);
