import React from 'react';
import { localName } from '../utils';
import { Term } from 'rdf-js';

type Props = {
  value: Term;
};

const TermWrapper: React.StatelessComponent<Props> = ({ value }) => {
  return <a href={'#'}>
    {localName(value)}
  </a>;
};

export default TermWrapper;
