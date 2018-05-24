import React from 'react';
import { Table, TableProps } from 'reactstrap';
import { NamedNode, BlankNode, Quad } from '../model';
import Label from '../containers/Label';

export interface Props {
  readonly quads: Quad[];
  readonly tableProps?: TableProps;
}

const PropertyTable: React.StatelessComponent<Props> = ({ quads, tableProps }) => (
  <section>
    <Table {...tableProps}>
      <tbody>
        {quads.map(quad => (
          <tr key={quad.predicate.value.concat(quad.object.value)}>
            <th scope="row">
              <a href={quad.predicate.value}>
                <Label resource={quad.predicate} />
              </a>
            </th>
            <td>
              {quad.object instanceof NamedNode || quad.object instanceof BlankNode ? (
                <a href={quad.object.value}>
                  <Label resource={quad.object} />
                </a>
              ) : quad.object.value}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </section>
);

export default PropertyTable;
