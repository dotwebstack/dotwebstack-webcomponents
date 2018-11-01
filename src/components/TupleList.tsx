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
};

const cellFormatter = (cell, row): string => {
  return cell.value;
};

const tdStyle: CSSProperties = { whiteSpace: 'normal', wordBreak: 'break-word' };

const TupleList: React.StatelessComponent<Props> = ({ result, columns }) => {
  return (
    <BootstrapTable data={result.getBindingSets()} striped hover>
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
