import React, { CSSProperties } from 'react';
import { TupleResult } from '../lib/TupleResult';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

require('react-bootstrap-table/dist/react-bootstrap-table.min.css');

type Props = {
  result: TupleResult,
};

const cellFormatter = (cell, row): string => {
  return cell.value;
};

const tdStyle: CSSProperties = { whiteSpace: 'normal', wordBreak: 'break-word' };

const TupleList: React.StatelessComponent<Props> = ({ result }) => {
  return (
    <BootstrapTable data={result.getBindingSets()} striped hover>
      {result.getBindingNames().map((bindingName, i) => {
        return (
          <TableHeaderColumn
            key={ bindingName + '|' + i }
            isKey={ i === 0 }
            dataField={ bindingName }
            tdStyle={ tdStyle }
            dataFormat={ cellFormatter }>{bindingName}
          </TableHeaderColumn>);
      })}
    </BootstrapTable>
  );
};

export default TupleList;
