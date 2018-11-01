import React from 'react';
import TupleContext from '../components/TupleContext';
import TupleList, { Column } from '../components/TupleList';

const endpoint = 'https://data.pdok.nl/ld/dws/v1/doc/begrippen';

const columns: Column[] = [
  { name: 'label', label: 'Label' },
  { name: 'begrip', label: 'Begrip' },
  { name: 'definition', label: 'Definitie' },
];

export default () => (
  <div>
    <h1>Tuple</h1>
    <section className="mt-4">
      <TupleContext src={endpoint}>
        {result => (
          <TupleList result={result} columns={columns}/>
        )}
      </TupleContext>
    </section>
  </div>
);
