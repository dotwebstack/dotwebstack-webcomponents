import React from 'react';
import TupleList, { Column } from '../components/TupleList';
import TupleSearch from '../components/TupleSearch';
import GraphSearch from '../components/GraphSearch';
import { Resource } from '..';
import { namedNode } from '@rdfjs/data-model';

const tupleEndpoint = 'https://catalogus.kadaster.nl/concepten';
const graphEndpoint = 'https://catalogus.kadaster.nl/resource';
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
  },
  {
    predicate: namedNode('http://purl.org/dc/terms/extralabel'),
    label: 'Extra label',
  },
];

export default () => (
  <div>
    <h1>Search</h1>
    <section className="mt-4">
      <h2>Tuple search</h2>
      <div className="card card-default">
        <div className="card-body">
          <TupleSearch endpoint={tupleEndpoint} queryParam="term">
            {result => (
              <TupleList
                result={result}
                columns={columns}
              />
            )}
          </TupleSearch>
        </div>
      </div>
    </section>
    <section className="mt-4">
      <h2>Graph search</h2>
      <div className="card card-default">
        <div className="card-body">
          <GraphSearch endpoint={graphEndpoint} queryParam="subject">
            {store => (
              <Resource resourceIri={resourceIri} store={store} rows={rows} />
            )}
          </GraphSearch>
        </div>
      </div>
    </section>
  </div>
);
