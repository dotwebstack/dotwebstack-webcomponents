import React from 'react';
import { localName } from '../utils';
import { Term } from 'rdf-js';

type Props = {
  term: Term,
  local?: boolean,
  linkBuilder?: (term: Term) => string,
};

const Value: React.StatelessComponent<Props> = ({ term, local, linkBuilder }) => {
  if (!term) {
    return (
      <a></a>
    )
  }

  if (term.termType !== 'NamedNode') {
    return (
      <React.Fragment>{term.value}</React.Fragment>
    );
  }

  const value = local ? localName(term) : term.value;
  const href = linkBuilder ? linkBuilder(term) : term.value;

  return (
    <a href={href}>
      {value}
    </a>
  );
};

export default Value;
