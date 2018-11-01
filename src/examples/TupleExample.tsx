import React from 'react';
import TupleContext from '../components/TupleContext';
import TupleList from '../components/TupleList';

const endpoint = 'http://example.org';

export default () => (
  <div>
    <h1>Tuple</h1>
    <section className="mt-4">
      <TupleContext src={endpoint}>
        {data => (
          <TupleList data={data}/>
        )}
      </TupleContext>
    </section>
  </div>
);
