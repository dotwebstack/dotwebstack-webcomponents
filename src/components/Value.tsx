import React from 'react';
import { localName } from '../utils';
import { Term } from 'rdf-js';

type Props = {
  term: Term,
  local?: boolean,
  linkBuilder?: (url: string) => string,
};

const Value: React.StatelessComponent<Props> = ({ term, local, linkBuilder }) => {
  const value = local ? localName(term) : term.value;
  const href = linkBuilder ? linkBuilder(term.value) : term.value;

  return (
    <a href={href}>
      {value}
    </a>
  );
};

export default Value;
