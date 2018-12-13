import * as React from 'react';
import ReactDOM from 'react-dom';
import { renderComponent, createComponent } from '..';
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

describe('getComponent', () => {
  it('creates a component', () => {
    const store = new Store([]);
    const component = createComponent(Vocabulary, { store });
    expect(component).toEqual(<Vocabulary store={store} />);
  });
});

describe('renderComponent', () => {
  it('renders a component', () => {
    const store = new Store([]);
    const div = document.createElement('div');
    renderComponent(div, Vocabulary, { store });
    expect(ReactDOM.render).toHaveBeenCalledTimes(1);
    expect(ReactDOM.render).toHaveBeenCalledWith(<Vocabulary store={store} />, div);
  });

  it('renders a component within a graph context', async () => {
    const endpoint = 'http://example.org';
    const div = document.createElement('div');
    let testStore = new Store([]);
    await graphContext(endpoint)
      .then((store) => {
        testStore = store;
        renderComponent(div, Vocabulary, { store });
      });
    expect(ReactDOM.render).toHaveBeenCalledTimes(1);
    expect(ReactDOM.render).toHaveBeenCalledWith(<Vocabulary store={testStore} />, div);
  });
});
