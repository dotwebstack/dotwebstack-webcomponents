import React from 'react';
import { Quad, Term } from 'rdf-js';
import Store from '../lib/Store';
import { compareTerm } from '../utils';
import TermValue from './TermValue';

type Props = {
  resourceIri: Term,
  store: Store,
};

const Resource: React.StatelessComponent<Props> = ({ resourceIri, store }) => {
  const statements = store
    .findStatements(resourceIri)
    .sort((a: Quad, b: Quad) => compareTerm(a.predicate, b.predicate));

  return (
    <table className="table table-striped">
      <tbody>
      {statements.map(statement => (
        <tr>
          <th scope="row">
            <a href={statement.predicate.value}>
              <TermValue
                term={statement.predicate}
              />
            </a>
          </th>
          <td>
            {statement.object.termType === 'NamedNode' ? (
              <a href={statement.object.value}>
                <TermValue
                  term={statement.object}
                />
              </a>
            ) : statement.object.value}
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default Resource;
