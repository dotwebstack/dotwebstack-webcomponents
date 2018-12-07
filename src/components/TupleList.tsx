import { Term } from 'rdf-js';
import React, { CSSProperties } from 'react';
import { BootstrapTable, PaginationPostion, TableHeaderColumn } from 'react-bootstrap-table';
import i18next from '../i18n';
import { TupleResult } from '../lib/TupleResult';
import Value from './Value';
import { sortRows } from '../utils';

require('react-bootstrap-table/dist/react-bootstrap-table.min.css');

export type Column = {
  name: string;
  label?: string;
  sortable?: boolean;
  customRender?: (term: Term) => JSX.Element;
};

const tdStyle: CSSProperties = { whiteSpace: 'normal', wordBreak: 'break-word' };

type TupleListProps = {
  result: TupleResult,
  columns: Column[],
  pageSize?: number,
};

const cellFormatter = (cell: Term, {}, column: Column): any => {
  return column.customRender ? column.customRender(cell) :
    <Value
      term={cell}
      local={false}
    />;
};

const TupleList: React.StatelessComponent<TupleListProps> = ({ result, columns, pageSize }) => {
  let options;
  const paginationPos: PaginationPostion = 'top';

  if (pageSize) {
    options = {
      page: 1,
      sizePerPageList: [
        {
          text: '5', value: 5,
        },
        {
          text: '10', value: 10,
        },
        {
          text: '20', value: 20,
        },
        {
          text: '50', value: 50,
        },
      ],

      sizePerPage: pageSize.valueOf(),
      pageStartIndex: 1,
      paginationSize: 3,
      prePage: i18next.t('previous'),
      nextPage: i18next.t('next'),
      firstPage: i18next.t('first'),
      lastPage: i18next.t('last'),
      paginationPosition: paginationPos,
      paginationShowsTotal: true,
      hideSizePerPage: false,
      alwaysShowAllBtns: true,
      withFirstAndLast: true,
    };
  }

  return (
    <BootstrapTable
      data={result.getBindingSets()}
      pagination={usePagination(pageSize, result)}
      options={options} striped hover
    >
      {columns.map((column, i) => (
        <TableHeaderColumn
          key={column.name}
          isKey={i === 0}
          dataField={column.name}
          tdStyle={tdStyle}
          dataSort={column.sortable}
          dataFormat={cellFormatter}
          sortFunc={sortRows}
          sortFuncExtraData={column.sortable ? column.name : undefined}
          formatExtraData={column}>
          {column.label ? column.label : column.name}
        </TableHeaderColumn>
      ))}
    </BootstrapTable>
  );
};

export function usePagination(pageSize: any, result: TupleResult) {
  return pageSize !== undefined && result.getBindingSets().length >= pageSize;
}

export default TupleList;
