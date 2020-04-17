import { Hybrids, property, parent } from 'hybrids';
import { NamedNode } from 'rdf-js';
import { namedNode } from '@rdfjs/data-model';
import Graph, { IGraph } from './Graph';
import render, { html } from '../lib/render';
import { rdfs, skos } from '../lib/namespaces';
import { FastDataset } from '../lib/model';
import { localName } from '../lib/utils';

export interface ILabel extends HTMLElement {
  iri: NamedNode;
  graph: IGraph;
}

const getLabel = (store: FastDataset, iri: NamedNode): string => {
  const prefLabelQuads = Array.from(store.match(iri, skos.prefLabel));

  if (prefLabelQuads.length > 0) {
    return prefLabelQuads[0].object.value;
  }

  const labelQuads = Array.from(store.match(iri, rdfs.label));

  if (labelQuads.length > 0) {
    return labelQuads[0].object.value;
  }

  return localName(iri);
};

const Label: Hybrids<ILabel> = {
  iri: property(namedNode),
  graph: parent(Graph),
  render: render((host: ILabel) => {
    const label = getLabel(host.graph.store, host.iri);
    return html`${label}`;
  }),
};

export default Label;
