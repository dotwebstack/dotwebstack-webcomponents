import React from 'react';
import { TupleResult } from '../lib/TupleResult';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

require('react-bootstrap-table/dist/react-bootstrap-table.min.css');

type Props = {
  data: TupleResult,
};

const TupleList: React.StatelessComponent<Props> = ({ data }) => {
  console.log(data);
  const products: any[] = [
    { id: '1', name: 'appel', price: '1' },
    { id: '2', name: 'peer', price: '2' },
    { id: '3', name: 'banaan', price: '3' },
  ];
  return (
    <BootstrapTable data={products} striped hover>
      <TableHeaderColumn isKey dataField="id">Product ID</TableHeaderColumn>
      <TableHeaderColumn dataField="name">Product Name</TableHeaderColumn>
      <TableHeaderColumn dataField="price">Product Price</TableHeaderColumn>
    </BootstrapTable>
  );
};

export default TupleList;
