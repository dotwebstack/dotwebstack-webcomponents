import React from 'react';
import { localName } from '../utils';
import { Term } from 'rdf-js';

export type ValueProps = {
  local?: boolean,
  linkBuilder?: (term: Term) => string,
};

type Props = {
  term: Term,
};

const Value: React.StatelessComponent<ValueProps & Props> = ({ term, local, linkBuilder }) => {
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
