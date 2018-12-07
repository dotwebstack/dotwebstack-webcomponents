import React from 'react';
import Search from '../components/Search';
import { Column } from '../components/TupleList';

const endpoint = 'https://catalogus.kadaster.nl/concepten';

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

export default () => (
  <div>
    <h1>Searching</h1>
    <section className="mt-4">
      <Search endpoint={endpoint} columns={columns}/>
    </section>
  </div>
);
