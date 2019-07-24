import { namedNode } from '@rdfjs/data-model';
import { Label, GraphContext } from '..';
import React from 'react';
import Resource from '../components/Resource';
import { Term } from 'rdf-js';
// import { Term } from 'rdf-js';

const endpoint = 'https://regelgeving.omgevingswet.overheid.nl/id/concept/AanHuisVerbondenBeroep';
const resourceIri = namedNode(
  'http://regelgeving.omgevingswet.overheid.nl/id/concept/AanHuisVerbondenBeroep',
);
const rows = [
  {
    predicate: namedNode('https://nl.wikipedia.org/wiki/Uniform_resource_identifier'),
    label: 'URI',
    customRender: (_terms: Term[], ref: React.RefObject<HTMLTableCellElement>) => {
      if (ref.current && ref.current.innerText !== resourceIri.value) {
        ref.current.insertAdjacentHTML(
          'afterbegin',
          `<a href=${resourceIri.value}>${resourceIri.value}</a>`,
        );
      }
      return <a href={resourceIri.value}>{resourceIri.value}</a>;
    },
  },
  {
    predicate: namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
    label: 'Label',
  },
  {
    predicate: namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
    label: 'Type',
  },
  {
    predicate: namedNode('http://www.w3.org/2004/02/skos/core#prefLabel'),
    label: 'Term',
  },
  {
    predicate: namedNode('http://www.w3.org/2004/02/skos/core#inScheme'),
    label: 'Domein',
  },
  {
    predicate: namedNode('http://www.w3.org/2004/02/skos/core#member'),
    label: 'Lid',
  },
  {
    predicate: namedNode('http://xmlns.com/foaf/0.1/isPrimaryTopicOf'),
    label: 'Metadata',
  },
];

export default () => (
  <GraphContext src={endpoint}>
    {store => (
      <div>
        <h1>
          <Label store={store} resourceIri={resourceIri} />
        </h1>
        <section className="mt-4">
          <Resource store={store} resourceIri={resourceIri} rows={rows} showUri={true} />
        </section>
      </div>
    )}
  </GraphContext>
);
