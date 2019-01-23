import React from 'react';
import TupleContext from '../components/TupleContext';
import TupleList, { Column } from '../components/TupleList';
import { Term } from 'rdf-js';

const endpoint = 'https://data.pdok.nl/ld/dws/v1/doc/begrippen';

const columns: Column[] = [
  {
    name: 'label',
    label: 'Label',
    sortable: true,
    customRender: (term?: Term) => (term !== undefined
      ? <strong>{term.value}</strong>
      : <strong>-</strong>
    ),
  },
  {
    name: 'begrip',
    label: 'Begrip',
    sortable: true,
  },
  {
    name: 'definition',
    label: 'Definitie',
    sortable: false,
  },
];

export default () => (
  <div>
    <h1>TupleList</h1>
    <section className="mt-4">
      <TupleContext src={endpoint}>
        {result => (
          <TupleList
            result={result}
            columns={columns}
            pagination={true}
          />
        )}
      </TupleContext>
    </section>
  </div>
);
