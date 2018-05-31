import React from 'react';
import { TupleContext, TupleList } from '..';

const url = 'https://data.pdok.nl/ld/dws/v1/begrippen/bag';

export default () => (
  <div>
    <h1>Tuple List</h1>
    <section className="mt-4">
      <TupleContext src={url}>
        <TupleList columns={[
          { binding: 'concept', labelBinding: 'conceptLabel', header: 'row' },
          { binding: 'definition' },
        ]}/>
      </TupleContext>
    </section>
  </div>
);
