import React from 'react';
import { localName } from '../utils';
import { Term } from 'rdf-js';

type Props = {
  term: Term,
  local?: boolean,
  linkBuilder?: string,
};

const Value: React.StatelessComponent<Props> = ({ term, local, linkBuilder }) => {
  const termValue = local ? localName(term) : term.value;
  const link = linkBuilder ? linkBuilder : (local ? '#' + termValue : termValue);
  return (
    <a href={link}>
      {termValue}
    </a>
  );
};
export default Value;
