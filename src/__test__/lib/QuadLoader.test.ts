import QuadLoader from '../../lib/QuadLoader';
import fetchMock = require('fetch-mock');
import { Quad } from 'rdf-js';
import { parsedJsonLd, fooJsonLd } from '../TestData';

describe('QuadLoader::loadFromUrl', () => {
  fetchMock.mock('http://example.org',   fooJsonLd);
  fetchMock.mock('http://exampl3.org', { status: 404, body: {} });

  it('returns quads when loading from URL', async () => {
    const quadLoader = new QuadLoader();
    const promise: Promise<Quad[]> = quadLoader.loadFromUrl('http://example.org');
    await expect(promise).resolves.toEqual(parsedJsonLd);
  });

  it('returns empty list when loading from URL fails', async () => {
    const quadLoader = new QuadLoader();
    const promise: Promise<Quad[]> = quadLoader.loadFromUrl('http://exampl3.org');
    await expect(promise).resolves.toEqual([]);
  });
});
