import React from 'react';
import { DataFactory, GraphContext, Vocabulary } from '..';

const dataFactory = new DataFactory();
const vocab = dataFactory.namedNode('http://bag.basisregistraties.overheid.nl/def/bag');
// const subjectFilter = 'basisregistraties\.overheid\.nl';
const subjectFilter = '';

export default () => (
  <div>
    <h1>Vocabulary</h1>
    <section className="mt-4">
      <GraphContext src={vocab}>
        <Vocabulary subjectFilter={subjectFilter}/>
      </GraphContext>
    </section>
  </div>
);
