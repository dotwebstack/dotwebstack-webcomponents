import QuadLoader from '../../lib/QuadLoader';
import fetchMock = require('fetch-mock');
import { Quad } from 'rdf-js';
import { parsedJsonLd, fooJsonLd } from '../TestData';

describe('QuadLoader::loadFromUrl', () => {
  fetchMock.mock('http://example.org',   fooJsonLd);

  it('returns quads when loading from URL', () => {
    const quadLoader = new QuadLoader();
    const promise: Promise<Quad[]> = quadLoader.loadFromUrl('http://example.org');
    expect(promise).resolves.toEqual(parsedJsonLd);
  });
});
