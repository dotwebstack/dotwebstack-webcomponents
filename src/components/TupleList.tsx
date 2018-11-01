import React from 'react';
import { TupleResult } from '../lib/TupleResult';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

require('react-bootstrap-table/dist/react-bootstrap-table.min.css');

type Props = {
  data: TupleResult,
  pageSize?: number;
};

const TupleList: React.StatelessComponent<Props> = ({ data, pageSize }) => {
  console.log(data);
  const products: any[] = [
    { id: '1', name: 'appel', price: '16' },
    { id: '2', name: 'peer', price: '26' },
    { id: '3', name: 'banaan', price: '35' },
    { id: '4', name: 'perzik', price: '44' },
    { id: '5', name: 'kiwi', price: '53' },
    { id: '6', name: 'granaatappel', price: '26' },
    { id: '7', name: 'abrikoos', price: '17' },
    { id: '8', name: 'passiefruit', price: '81' },
    { id: '9', name: 'ananas', price: '34' },
    { id: '10', name: 'mango', price: '39' },
    { id: '11', name: 'kokosnoot', price: '19' },
    { id: '12', name: 'cashewnoot', price: '44' },
    { id: '13', name: 'pinda', price: '87' },
    { id: '14', name: 'winkelwagen', price: '10' },
    { id: '15', name: 'neutronenster', price: '51' },
    { id: '16', name: 'donderdag', price: '94' },
    { id: '17', name: 'paars', price: '98' },
  ];

  let options = undefined;

  if (pageSize) {
    const lessOrEqualRowsThanPageSize = products.length <= pageSize;
    options = {
      page: 1,
      sizePerPageList: [{
        text: '5', value: 5,
      }, {
        text: '10', value: 10,
      }, {
        text: 'All', value: products.length,
      }],

      sizePerPage: pageSize.valueOf(),
      pageStartIndex: 1,
      paginationSize: 3,
      prePage: 'Vorige',
      nextPage: 'Volgende',
      firstPage: 'Eerste',
      lastPage: 'Laatste',
      paginationShowsTotal: !lessOrEqualRowsThanPageSize,
      hideSizePerPage: lessOrEqualRowsThanPageSize,
      alwaysShowAllBtns: !lessOrEqualRowsThanPageSize,
      withFirstAndLast: lessOrEqualRowsThanPageSize,
    };
  }

  return (
    <BootstrapTable data={products} pagination={pageSize !== undefined} options={options} striped
                    hover>
      <TableHeaderColumn isKey dataField="id">Product ID</TableHeaderColumn>
      <TableHeaderColumn dataField="name">Product Name</TableHeaderColumn>
      <TableHeaderColumn dataField="price">Product Price</TableHeaderColumn>
    </BootstrapTable>
  );
};

export default TupleList;
