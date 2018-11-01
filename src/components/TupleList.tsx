import React, { CSSProperties } from 'react';
import { TupleResult } from '../lib/TupleResult';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

require('react-bootstrap-table/dist/react-bootstrap-table.min.css');

export type Column = {
  name: string;
  label?: string;
};

type Props = {
  result: TupleResult,
  columns: Column[],
  pageSize?: number,
};

const cellFormatter = (cell: any): string => {
  return cell.value;
};

const tdStyle: CSSProperties = { whiteSpace: 'normal', wordBreak: 'break-word' };

const TupleList: React.StatelessComponent<Props> = ({ result, columns, pageSize }) => {
  let options = undefined;

  if (pageSize) {
    const lessOrEqualRowsThanPageSize = result.getBindingSets().length <= pageSize;
    options = {
      page: 1,
      sizePerPageList: [{
        text: '5', value: 5,
      }, {
        text: '10', value: 10,
      }, {
        text: 'All', value: result.getBindingSets().length,
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
    <BootstrapTable data={result.getBindingSets()} pagination={pageSize !== undefined} options={options} striped hover>
      {columns.map((column, i) => {
        return (
          <TableHeaderColumn
            key={column.name + '|' + i}
            isKey={i === 0}
            dataField={column.name}
            tdStyle={tdStyle}
            dataFormat={cellFormatter}>
            {column.label ? column.label : column.name}
          </TableHeaderColumn>);
      })}
    </BootstrapTable>
  );
};

export default TupleList;
