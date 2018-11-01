import React from 'react';
import TupleContext from '../components/TupleContext';
import TupleList from '../components/TupleList';

const endpoint = 'https://data.pdok.nl/ld/dws/v1/doc/begrippen';

export default () => (
  <div>
    <h1>Tuple</h1>
    <section className="mt-4">
      <TupleContext src={endpoint}>
        {result => (
          <TupleList result={result}/>
        )}
      </TupleContext>
    </section>
  </div>
);
