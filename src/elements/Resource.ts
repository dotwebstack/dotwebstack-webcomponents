import { Hybrids, property, parent } from 'hybrids';
import { NamedNode } from 'rdf-js';
import { namedNode } from '@rdfjs/data-model';
import Graph, { IGraph } from './Graph';
import lit, { html } from '../lib/lit';
import { localName } from '../lib/utils';

export interface IResource extends HTMLElement {
  iri: NamedNode;
  graph: IGraph;
}

const Resource: Hybrids<IResource> = {
  iri: property(namedNode),
  graph: parent(Graph),
  render: lit((host: IResource) => {
    const store = host.graph.store;
    const quads = Array.from(store.match(host.iri));

    return html`
      <table class="table">
        <tbody>
          ${quads.map(quad => html`
            <tr>
              <th scope="row">${localName(quad.predicate)}</th>
              <td>${quad.object.value}</td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }),
};

export default Resource;
