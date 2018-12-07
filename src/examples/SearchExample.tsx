import React from 'react';
import Search from '../components/Search';
import TupleList, { Column } from '../components/TupleList';
import Vocabulary from '../components/Vocabulary';

const tupleEndpoint = 'https://catalogus.kadaster.nl/concepten';
const graphEndpoint = '';

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

const tupleChild = (result: any) => (
  <TupleList
            result={result}
            columns={columns}
            pageSize={10}/>
);

const graphChild = (store: any) => (<Vocabulary store={store} />
);

export default () => (
  <div>
    <h1>Searching</h1>
    <section className="mt-4">
    Tuple search
      <Search endpoint={tupleEndpoint} columns={columns} children={tupleChild}/>
    </section>
    <section className="mt-4">
    Graph Search
      <Search endpoint={graphEndpoint} children={graphChild}/>
    </section>
  </div>
);
