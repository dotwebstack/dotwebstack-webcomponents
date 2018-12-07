import React from 'react';
import { GraphContext, Vocabulary } from '..';

// const endpoint = 'https://bag.basisregistraties.overheid.nl/def/bag';
const endpoint = 'https://catalogus.kadaster.nl/model';
const link = 'PREFIX_';

export default () => (
  <div>
    <h1>Vocabulary</h1>
    <section className="mt-4">
      <GraphContext src={endpoint}>
        {store => (
          <Vocabulary store={store} linkbuilder={link} />
        )}
      </GraphContext>
    </section>
  </div>
);
