import React from 'react';
import { localName } from '../utils';
import { Term } from 'rdf-js';

type Props = {
  term: Term;
  local: boolean;
};

const TermWrapper: React.StatelessComponent<Props> = ({ term, local }) => {
  return <a href={ local ? `#${localName(term)}` : term.value}>
    {localName(term)}
  </a>;
};

export default TermWrapper;
