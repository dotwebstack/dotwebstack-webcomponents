import React from 'react';
import { BindingSet } from '../model';
import { Table, TableProps } from 'reactstrap';

export interface Props {
  readonly bindingSets: BindingSet[];
  readonly columns: [{ binding: string, labelBinding?: string, header?: string, class?: string }];
  readonly tableProps?: TableProps;
}

function bindingSetToTableRow(key: number, bindingSet: BindingSet,
                              columns: [{ binding: string; labelBinding?: string; header?: string, class?: string }]) {
  return (
    <tr className="row" key={key}>
      {columns.map((column) => {
        {
          if (column.header) {
            return <th className={column.class} key={bindingSet[column.binding].value} scope={column.header}>
              <a href={bindingSet[column.binding].value}>
                {bindingSet[column.labelBinding ? column.labelBinding : column.binding].value}
              </a>
            </th>;
          }
          return <td className={column.class} key={bindingSet[column.binding].value}>
            {bindingSet[column.binding].value}
          </td>;
        }
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
