import React from 'react';
import TupleList, { Column } from '../components/TupleList';
import { renderComponent } from '..';

const tupleEndpoint = 'https://catalogus.kadaster.nl/concepten?term=';

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
 <TupleList result={result} columns={columns} pageSize={10} ></TupleList> );

const tupleSearchExample = () => {
  renderComponent(document.getElementById('Search'), 'TupleSearch', {endpoint : tupleEndpoint, children : tupleChild })
}

export default () => (
  <div id='Search'>
    <h1>Searching</h1>
    {tupleSearchExample()}
  </div>
);
