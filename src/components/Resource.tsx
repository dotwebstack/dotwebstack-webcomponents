import React from 'react';
import { NamedNode, Quad, Term } from 'rdf-js';
import Store from '../lib/Store';
import { localName, compareTerm } from '../utils';

type Props = {
  resourceIri: Term,
  store: Store,
  rows: Row[],
};

type Row = {
  predicate: NamedNode,
  label?: string,
  render?: (terms: Term[]) => JSX.Element,
};

const Resource: React.StatelessComponent<Props> = ({ resourceIri, store, rows }) => {
  const statements = store
    .findStatements(resourceIri)
    .sort((a: Quad, b: Quad) => compareTerm(a.predicate, b.predicate));

  return (
    <table className="table table-striped">
      <tbody>
      {rows.map((row) => {
        const foundStatements = statements.filter(statement => row.predicate.value === statement.predicate.value);
        return (
          <tr>
            <th scope="row">{row.label ? row.label : localName(row.predicate)}</th>
            <td>
              <ul>
              {foundStatements.map((statement) => {
                return (<li><a href={statement.object.value}>{localName(statement.object)}</a></li>);
              })}
              </ul>
            </td>
          </tr>
        );
      })}
      </tbody>
    </table>
  );
};

export default Resource;
