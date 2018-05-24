import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import DataFactory from '../DataFactory';
import { loadRdf, ActionTypes } from '../actions';

// Because of typing issues: https://github.com/arnaudbenard/redux-mock-store/issues/144
const configureMockStore = require('redux-mock-store');

const dataFactory = new DataFactory();
const mockStore = configureMockStore([
  thunk,
]);

afterEach(fetchMock.restore);

describe('loadRdf', () => {
  test('dispatches LOAD_RDF_REQUEST_SUCCESS event when HTTP request succeeds', () => {
    const subject = dataFactory.namedNode('http://foo');
    const predicate = dataFactory.namedNode('http://schema.org/name');
    const object = dataFactory.literal('John');

    const doc = {
      '@context': { name: predicate.value },
      '@id': subject.value,
      name: object.value,
    };

    fetchMock.getOnce('*', {
      body: JSON.stringify(doc),
      headers: {
        'content-type': 'application/ld+json',
      },
    });

    const expectedQuads = [dataFactory.quad(subject, predicate, object)];

    const expectedActions = [
      { type: ActionTypes.LOAD_RDF_REQUEST, payload: subject.value },
      { type: ActionTypes.LOAD_RDF_REQUEST_SUCCESS, payload: expectedQuads },
      { type: ActionTypes.LOAD_RDF_COMPLETED },
    ];

    const store = mockStore();

    return store.dispatch(loadRdf(subject)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  test('dispatches LOAD_RDF_REQUEST_FAILED event when HTTP request returns error status', () => {
    const subject = dataFactory.namedNode('http://foo');
    const error = new Error('Not Found');

    fetchMock.getOnce('*', {
      status: 404,
    });

    const expectedActions = [
      { type: ActionTypes.LOAD_RDF_REQUEST, payload: subject.value },
      { type: ActionTypes.LOAD_RDF_REQUEST_FAILURE, payload: error },
      { type: ActionTypes.LOAD_RDF_COMPLETED },
    ];

    const store = mockStore();

    return store.dispatch(loadRdf(subject)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  test('dispatches LOAD_RDF_REQUEST_FAILED event when HTTP request fails', () => {
    const subject = dataFactory.namedNode('http://foo');
    const error = new Error('Unknown Error');

    fetchMock.getOnce('*', {
      throws: error,
    });

    const expectedActions = [
      { type: ActionTypes.LOAD_RDF_REQUEST, payload: subject.value },
      { type: ActionTypes.LOAD_RDF_REQUEST_FAILURE, payload: error },
      { type: ActionTypes.LOAD_RDF_COMPLETED },
    ];

    const store = mockStore();

    return store.dispatch(loadRdf(subject)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
