import React from 'react';
import TupleContext from '../components/TupleContext';
import TupleList, { Column } from '../components/TupleList';
import { Term } from 'rdf-js';

const endpoint = 'https://stelselcatalogus.omgevingswet.overheid.nl/concepten';

const columns: Column[] = [
  {
    name: 'resource_label',
    label: 'Label',
    sortable: true,
    customRender: (term?: Term) => (term !== undefined
      ? <strong>{term.value}</strong>
      : <strong>-</strong>
    ),
  },
  {
    name: 'uitleg',
    label: 'Definitie',
    sortable: true,
  },
];

export default () => (
  <div>
    <h1>TupleList</h1>
    <section className="mt-4">
      <TupleContext src={endpoint}>
        {result => (
              <TupleList
            suggest={{ suggestions: [result, 'resource_label'] }}
            search={ { fields: ['resource_label', 'uitleg'], instant: false }}
            alphabeticIndexBar={ { field: 'resource_label' } }
            result={result}
            columns={columns}
            pagination={true}
            sortByColumn={['resource_label', true]}
          />
        )}
      </TupleContext>
    </section>
  </div>
);
