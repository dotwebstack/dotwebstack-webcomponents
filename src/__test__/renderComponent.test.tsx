import * as React from 'react';
import renderComponent from '../renderComponent';
import { render } from 'react-dom';
import { namedNode } from '@rdfjs/data-model';
import Store from '../lib/Store';
import Vocabulary from '../components/Vocabulary';
import { graphContext } from '../components/GraphContext';
import fetchMock = require('fetch-mock');

const fooJsonLd = {
  'http://schema.org/name': [{ '@value': 'Manu Sporny' }],
  'http://schema.org/url': [{ '@id': 'http://manu.sporny.org/' }],
  'http://schema.org/image': [{ '@id': 'http://manu.sporny.org/images/manu.png' }],
};

jest.mock('react-dom');
fetchMock.mock('http://example.org', fooJsonLd);

afterEach(jest.resetAllMocks);

describe('renderComponent', () => {
  it('renders component when found', () => {
    const ontologyIRI = namedNode('http://foo');
    const store = new Store([]);
    const props = { ontologyIRI, store };

    const div = document.createElement('div');
    renderComponent(div, 'Vocabulary', props);
    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledWith(<Vocabulary ontologyIRI={ontologyIRI} store={store} />, div);
  });

  it('throws error when component not found', () => {
    const div = document.createElement('div');
    expect(() => renderComponent(div, 'Foo')).toThrowError();
  });

  it('renders with graphContext', async () => {
    const endpoint = 'http://example.org';
    const div = document.createElement('div');
    const ontologyIRI = namedNode('http://schema.org/url');
    let testStore = new Store([]);
    await graphContext(endpoint)
    .then((store) => {
      testStore = store;
      renderComponent(
        div,
        'Vocabulary',
        {
          store,
          ontologyIRI,
        },
      );
    });
    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledWith(<Vocabulary ontologyIRI={ontologyIRI} store={testStore} />, div);
  });
});
