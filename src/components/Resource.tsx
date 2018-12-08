import React from 'react';
import { NamedNode, Quad, Term } from 'rdf-js';
import Store from '../lib/Store';
import { localName, compareTerm } from '../utils';
import Value from './Value';

type Props = {
  resourceIri: Term,
  store: Store,
  rows: Row[],
  linkBuilder?: (term: Term) => string,
};

type Row = {
  predicate: NamedNode,
  label?: string,
  customRender?: (terms: Term[]) => JSX.Element,
};

const Resource: React.StatelessComponent<Props> = ({ resourceIri, store, rows, linkBuilder }) => {
  const statements = store
    .findStatements(resourceIri)
    .sort((a: Quad, b: Quad) => compareTerm(a.predicate, b.predicate));

  return (
    <table className="table table-striped">
      <tbody>
      {rows.map((row) => {
        const terms: Term[] = statements
          .filter(statement => row.predicate.value === statement.predicate.value)
          .map(statement => statement.object);

        return (
          <tr key={row.predicate.value}>
            <th scope="row">
              <a href={row.predicate.value}>
                {row.label ? row.label : localName(row.predicate)}
              </a>
            </th>
            <td>
              {row.customRender && row.customRender(terms)}
              {!row.customRender && terms.length === 0 &&
              <span>-</span>
              }
              {!row.customRender && terms.length !== 0 &&
              <ul className="list-unstyled mb-0">
                {terms.map((term) => {
                  return (
                    <li key={term.value}>
                      <Value
                        term={term}
                        linkBuilder={linkBuilder}
                      />
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
