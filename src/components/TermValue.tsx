import React from 'react';
import { localName } from '../utils';
import { Term } from 'rdf-js';

type Props = {
  term: Term;
  local?: boolean;
};

const TermValue: React.StatelessComponent<Props> = ({ term, local }) => {
  if (!term) {
    return <span></span>;
  }
  if (term.termType === 'NamedNode') {
    return (
      <a href={local ? `#${localName(term)}` : term.value}>
        {localName(term)}
      </a>
    );
  }
  return (
    <span>{term.value}</span>
  );
};
export default TermValue;
