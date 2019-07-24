import React from 'react';
import { NamedNode, Quad, Term } from 'rdf-js';
import Store from '../lib/Store';
import { localName, compareTerm } from '../utils';
import Value, { ValueProps } from './Value';

type Props = {
  resourceIri: Term;
  store: Store;
  rows: Row[];
  valueProps?: ValueProps;
  showUri?: boolean;
};

type Row = {
  predicate: NamedNode;
  label?: string;
  customRender?: (
    terms: Term[],
    ref: React.MutableRefObject<HTMLTableCellElement | null>,
  ) => JSX.Element | HTMLElement;
};

interface RefMap {
  [key: string]: React.MutableRefObject<HTMLTableCellElement | null>;
}

const Resource: React.StatelessComponent<Props> = ({ resourceIri, store, rows, valueProps }) => {
  const statements = store
    .findStatements(resourceIri)
    .sort((a: Quad, b: Quad) => compareTerm(a.predicate, b.predicate));
  const refMap: RefMap = {};
  rows.forEach(row => {
    if (row.customRender) {
      refMap[row.predicate.value] = React.useRef(null);
    }
  });

  const customRender = (
    row: Row,
    terms: Term[],
    ref: React.MutableRefObject<HTMLTableCellElement | null>,
  ) => {
    setTimeout(() => {
      if (row.customRender) {
        row.customRender(terms, ref);
      }
    },         10);
  };

  return (
    <div>
      <table className="table table-striped">
        <tbody>
          {rows.map(row => {
            const terms: Term[] = statements
              .filter(statement => row.predicate.value === statement.predicate.value)
              .map(statement => statement.object);

            const refRow = refMap[row.predicate.value];

            return (
              <tr key={row.predicate.value}>
                <th scope="row">
                  <a href={row.predicate.value}>
                    {row.label ? row.label : localName(row.predicate)}
                  </a>
                </th>
                <td ref={refRow}>
                  {row.customRender && customRender(row, terms, refRow)}
                  {!row.customRender && terms.length === 0 && <span>-</span>}
                  {!row.customRender &&
                    terms.length !== 0 &&
                    terms.map(term => (
                      <React.Fragment key={term.value}>
                        <Value term={term} {...valueProps} />
                        <br />
                      </React.Fragment>
                    ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Resource;
