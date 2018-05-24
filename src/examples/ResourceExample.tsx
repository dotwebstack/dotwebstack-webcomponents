import React from 'react';
import { DataFactory, GraphContext, Label, Resource } from '..';

const dataFactory = new DataFactory();

const resource = dataFactory.namedNode(
  'http://bag.basisregistraties.overheid.nl/bag/id/ligplaats/0003020000000004');
const vocab = dataFactory.namedNode('https://bag.basisregistraties.overheid.nl/def/bag');

export default () => (
  <GraphContext src={[resource, vocab]}>
    <h1><Label resource={resource} /></h1>
    <section className="mt-4">
      <h2 className="mb-3">Eigenschappen</h2>
      <Resource iri={resource} tableProps={{ striped: true }} />
    </section>
  </GraphContext>
);
