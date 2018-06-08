import React from 'react';
import { BindingSet, Column } from '../model';
import { Table, TableProps } from 'reactstrap';

export interface Props {
  readonly bindingSets: BindingSet[];
  readonly columns: Column[];
  readonly tableProps?: TableProps;
}

function bindingSetToTableRow(key: number, bindingSet: BindingSet, columns: Column[]) {
  return (
    <tr className="row" key={key}>
      {columns.map((column: Column) => {
        if (column.header) {
          return <th className={column.className} key={bindingSet[column.binding].value} scope={column.header}>
            <a href={bindingSet[column.binding].value}>
              {bindingSet[column.labelBinding ? column.labelBinding : column.binding].value}
            </a>
          </th>;
        }
        return <td className={column.className} key={bindingSet[column.binding].value}>
          {bindingSet[column.binding].value}
        </td>;
      })}
    </tr>
  );
}

const TupleListTable: React.StatelessComponent<Props> = ({ bindingSets, tableProps, columns }) => (
    <Table {...tableProps}>
      <tbody>
        {bindingSets.map(bindingSet => bindingSetToTableRow(bindingSets.indexOf(bindingSet), bindingSet, columns))}
      </tbody>
    </Table>
);

export default TupleListTable;
