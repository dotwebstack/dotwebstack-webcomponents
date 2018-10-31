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
  customRender?: (object: any) => JSX.Element,
  customValue?: any,
};

const listStyle = {
  listStyle: 'none',
};

const Resource: React.StatelessComponent<Props> = ({ resourceIri, store, rows }) => {
  const statements = store
    .findStatements(resourceIri)
    .sort((a: Quad, b: Quad) => compareTerm(a.predicate, b.predicate));

  return (
    <table className="table table-striped">
      <tbody>
      {rows.map((row) => {
        const predicateStatements = statements.filter(statement => row.predicate.value === statement.predicate.value);
        return (
          <tr key={row.predicate.value}>
            <th scope="row">
              <a href={row.predicate.value}>
                {row.label ? row.label : localName(row.predicate)}
              </a>
            </th>
            <td>
              {row.customRender && row.customValue && row.customRender(row.customValue)}
              {!row.customRender &&
              <ul>
                {predicateStatements.length === 0 && '-'}
                {predicateStatements.map((statement, i) => {
                  return (
                    <li key={statement.predicate.value + '|' + i} style={listStyle}>
                      <a href={statement.object.value}>{localName(statement.object)}</a>
                    </li>
                  );
                })}
              </ul>
              }
            </td>
          </tr>
        );
      })}
      </tbody>
    </table>
  );
};

export default Resource;
