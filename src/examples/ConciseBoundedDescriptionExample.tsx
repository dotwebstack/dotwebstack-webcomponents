import { namedNode } from '@rdfjs/data-model';
import React from 'react';
import ConciseBoundedDescription from '../components/ConciseBoundedDescription';
import { GraphContext } from '..';
import { rdf } from '../vocab';

const endpoint = 'https://bag.basisregistraties.overheid.nl/bag/doc/2011031800000000/pand/0200100000085932';

const BAG = 'http://bag.basisregistraties.overheid.nl/def/bag#';
const bag = {
  beginGeldigheid: namedNode(`${BAG}beginGeldigheid`),
  aanduidingInactief: namedNode(`${BAG}aanduidingInactief`),
  geconstateerd: namedNode(`${BAG}geconstateerd`),
  inOnderzoek: namedNode(`${BAG}inOnderzoek`),
};

const prefixes = {
  bag: BAG,
  pdok: 'http://data.pdok.nl/def/pdok#',
};

const rows = [
  { predicate: bag.beginGeldigheid },
  { predicate: rdf.type },
  { predicate: bag.aanduidingInactief },
  { predicate: bag.inOnderzoek },
];

export default () => (
  <GraphContext src={endpoint}>
    {store => (
      <div>
        <section className="mt-4">
          <ConciseBoundedDescription
            store={store}
            prefixes={prefixes}
            informationResourceCollapsedRows={rows}
          />
        </section>
      </div>
    )}
  </GraphContext>
);
