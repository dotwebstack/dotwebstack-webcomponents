import Store from '../lib/Store';
import { namedNode } from '@rdfjs/data-model';
import { RDFS, SKOS } from '../namespaces';
import React from 'react';
import { localName } from '../utils';
import { Term } from 'rdf-js';

type Props = {
  resourceIri: Term;
  store: Store;
};

const LabelComponent: React.StatelessComponent<Props> = ({ resourceIri, store }) => {
  const prefLabel = store.findObjects(namedNode(resourceIri.value), namedNode(SKOS + 'prefLabel'));
  if (prefLabel.length !== 0) {
    return <React.Fragment>{prefLabel[0].value}</React.Fragment>;
  }
  const fallbackLabel = store.findObjects(namedNode(resourceIri.value), namedNode(RDFS + 'label'));
  if (fallbackLabel.length !== 0) {
    return <React.Fragment>{fallbackLabel[0].value}</React.Fragment>;
  }
  return <React.Fragment>{localName(resourceIri)}</React.Fragment>;
};

export default LabelComponent;
