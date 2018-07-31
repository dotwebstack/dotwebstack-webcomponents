import React from 'react';
import { Table, TableProps } from 'reactstrap';
import { Quad } from 'rdf-js';
import Label from '../containers/Label';

type Props = {
  store: Quad[],
  tableProps?: TableProps,
};

const PropertyTable: React.StatelessComponent<Props> = ({ store, tableProps }) => (
  <section>
    <Table {...tableProps}>
      <tbody>
        {store.map(quad => (
          <tr key={quad.predicate.value.concat(quad.object.value)}>
            <th scope="row">
              <a href={quad.predicate.value}>
                <Label resource={quad.predicate} />
              </a>
            </th>
            <td>
              {quad.object.termType === 'NamedNode' || quad.object.termType === 'BlankNode' ? (
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
