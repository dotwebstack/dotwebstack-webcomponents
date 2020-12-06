// import { namedNode } from '@rdfjs/data-model';
import React from 'react';
import ConciseBoundedDescription from '../components/ConciseBoundedDescription';
import { /*Label,*/ GraphContext } from '..';

// const props = {
// };

const endpoint = 'https://bag.basisregistraties.overheid.nl/bag/doc/2011031800000000/pand/0200100000085932';
// const resourceIri = namedNode('http://bag.basisregistraties.overheid.nl/bag/id/pand/0200100000085932');

const resourceProps = {
  prefixes: {
    bag: 'http://bag.basisregistraties.overheid.nl/def/bag#',
  },
};

export default () => (
  <GraphContext src={endpoint}>
    {store => (
      <div>
        {/* <h1><Label store={store} resourceIri={resourceIri} /></h1>
        <p>{resourceIri.value}</p> */}
        <section className="mt-4">
          <ConciseBoundedDescription
            store={store}
            resourceProps={resourceProps}
          />
        </section>
      </div>
    )}
  </GraphContext>
);
