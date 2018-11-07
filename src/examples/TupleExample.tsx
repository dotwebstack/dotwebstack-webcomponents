import React from 'react';
import TupleContext from '../components/TupleContext';
import TupleList, { Column } from '../components/TupleList';
import { Term } from 'rdf-js';

const endpoint = 'https://data.pdok.nl/ld/dws/v1/doc/begrippen';

const columns: Column[] = [
  {
    name: 'label',
    label: 'Label',
    customRender: (term: Term) => {
      return (<h3>{term.value}</h3>);
    },
  },
  {
    name: 'begrip',
    label: 'Begrip',
    sortable: true,
  },
  {
    name: 'definition',
    label: 'Definitie',
  },
];

export default () => (
  <div>
    <h1>Tuple</h1>
    <section className="mt-4">
      <TupleContext src={endpoint}>
        {result => (
          <TupleList
            result={result}
            columns={columns}
            pageSize={10}/>
        )}
      </TupleContext>
    </section>
  </div>
);
