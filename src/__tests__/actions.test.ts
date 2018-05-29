import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import DataFactory from '../DataFactory';
import { loadRdf, ActionTypes } from '../actions';
import { NamedNode } from '../model';

// Because of typing issues: https://github.com/arnaudbenard/redux-mock-store/issues/144
const configureMockStore = require('redux-mock-store');

const dataFactory = new DataFactory();

const mockStore = configureMockStore([
  thunk,
]);

afterEach(fetchMock.restore);

describe('actions::loadRdf', () => {
  it('dispatches LOAD_RDF_REQUEST_SUCCESS event when HTTP request succeeds', () => {
    const fooQuad = dataFactory.quad(
      dataFactory.namedNode('http://foo'),
      dataFactory.namedNode('http://schema.org/name'),
      dataFactory.literal('Foo'),
    );

    const fooDoc = {
      '@context': { name: fooQuad.predicate.value },
      '@id': fooQuad.subject.value,
      name: fooQuad.object.value,
    };

    fetchMock.getOnce('https://foo', {
      body: JSON.stringify(fooDoc),
      headers: {
        'content-type': 'application/ld+json',
      },
    });

    const expectedQuads = [fooQuad];

    const expectedActions = [
      { type: ActionTypes.LOAD_RDF_REQUEST, payload: fooQuad.subject.value },
      { type: ActionTypes.LOAD_RDF_REQUEST_SUCCESS, payload: expectedQuads },
      { type: ActionTypes.LOAD_RDF_COMPLETED },
    ];

    const store = mockStore();

    return store.dispatch(loadRdf(fooQuad.subject as NamedNode)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('dispatches LOAD_RDF_REQUEST_SUCCESS event when multiple HTTP requests succeed', () => {
    const fooQuad = dataFactory.quad(
      dataFactory.namedNode('http://foo'),
      dataFactory.namedNode('http://schema.org/name'),
      dataFactory.literal('Foo'),
    );

    const barQuad = dataFactory.quad(
      dataFactory.namedNode('http://bar'),
      dataFactory.namedNode('http://schema.org/name'),
      dataFactory.literal('Bar'),
    );

    const fooDoc = {
      '@context': { name: fooQuad.predicate.value },
      '@id': fooQuad.subject.value,
      name: fooQuad.object.value,
    };

    const barDoc = {
      '@context': { name: barQuad.predicate.value },
      '@id': barQuad.subject.value,
      name: barQuad.object.value,
    };

    fetchMock.getOnce('https://foo', {
      body: JSON.stringify(fooDoc),
      headers: {
        'content-type': 'application/ld+json',
      },
    });

    fetchMock.getOnce('https://bar', {
      body: JSON.stringify(barDoc),
      headers: {
        'content-type': 'application/ld+json',
      },
    });

    const expectedActions = [
      { type: ActionTypes.LOAD_RDF_REQUEST, payload: fooQuad.subject.value },
      { type: ActionTypes.LOAD_RDF_REQUEST, payload: barQuad.subject.value },
      { type: ActionTypes.LOAD_RDF_REQUEST_SUCCESS, payload: [fooQuad] },
      { type: ActionTypes.LOAD_RDF_REQUEST_SUCCESS, payload: [barQuad] },
      { type: ActionTypes.LOAD_RDF_COMPLETED },
    ];

    const store = mockStore();

    return store.dispatch(loadRdf([fooQuad.subject, barQuad.subject] as NamedNode[])).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('dispatches LOAD_RDF_REQUEST_FAILED event when HTTP request returns error status', () => {
    const subject = dataFactory.namedNode('http://foo');
    const error = new Error('Not Found');

    fetchMock.getOnce('*', {
      status: 404,
    });

    const expectedActions = [
      { type: ActionTypes.LOAD_RDF_REQUEST, payload: subject.value },
      { type: ActionTypes.LOAD_RDF_REQUEST_FAILURE, payload: error, error: true },
      { type: ActionTypes.LOAD_RDF_COMPLETED },
    ];

    const store = mockStore();

    return store.dispatch(loadRdf(subject)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('dispatches LOAD_RDF_REQUEST_FAILED event when HTTP request fails', () => {
    const subject = dataFactory.namedNode('http://foo');
    const error = new Error('Unknown Error');

    fetchMock.getOnce('*', {
      throws: error,
    });

    const expectedActions = [
      { type: ActionTypes.LOAD_RDF_REQUEST, payload: subject.value },
      { type: ActionTypes.LOAD_RDF_REQUEST_FAILURE, payload: error, error: true },
      { type: ActionTypes.LOAD_RDF_COMPLETED },
    ];

    const store = mockStore();

    return store.dispatch(loadRdf(subject)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
