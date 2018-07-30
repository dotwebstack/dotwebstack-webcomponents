import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import { loadTuples, ActionTypes } from '../actions';
import SparqlResultsJsonParser from '../parser/SparqlResultsJsonParser';

// Because of typing issues: https://github.com/arnaudbenard/redux-mock-store/issues/144
const configureMockStore = require('redux-mock-store');

const mockStore = configureMockStore([
  thunk,
]);

afterEach(fetchMock.restore);

describe('actions::loadTuples', () => {
  it('dispatches LOAD_TUPLES_REQUEST_SUCCESS event when HTTP request succeeds', () => {
    const url = 'https://foo';
    const fooJson = {
      head: {
        vars: [
          'begrip',
          'label',
          'definition',
        ],
      },
      results: {
        bindings: [
          {
            definition: {
              'xml:lang': 'nl',
              type: 'literal',
              value: 'Formeel afgebakende ligplaats of standplaats.',
            },
            label: {
              'xml:lang': 'nl',
              type: 'literal',
              value: 'Plaats aangewezen',
            },
            begrip: {
              type: 'uri',
              value: 'http://bag.basisregistraties.overheid.nl/id/begrip/PlaatsAangewezen',
            },
          },
          {
            definition: {
              'xml:lang': 'nl',
              type: 'literal',
              value: 'Verdwenen ligplaats of standplaats.',
            },
            label: {
              'xml:lang': 'nl',
              type: 'literal',
              value: 'Plaats ingetrokken',
            },
            begrip: {
              type: 'uri',
              value: 'http://bag.basisregistraties.overheid.nl/id/begrip/PlaatsIngetrokken',
            },
          },
        ],
      },
    };

    fetchMock.getOnce(url, {
      body: JSON.stringify(fooJson),
      headers: {
        'content-type': 'application/sparql-results+json',
      },
    });

    const sparqlResultsJsonParser = new SparqlResultsJsonParser();

    const expectedActions = [
      { type: ActionTypes.LOAD_TUPLES_REQUEST, payload: url },
      { type: ActionTypes.LOAD_TUPLES_REQUEST_SUCCESS, payload: sparqlResultsJsonParser.parse(fooJson) },
    ];

    const store = mockStore();

    return store.dispatch(loadTuples('https://foo')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('dispatches LOAD_TUPLES_REQUEST_FAILED event when HTTP request returns error status', () => {
    const url = 'https://foo';
    const error = new Error('Not Found');

    fetchMock.getOnce('*', {
      status: 404,
    });

    const expectedActions = [
      { type: ActionTypes.LOAD_TUPLES_REQUEST, payload: url },
      { type: ActionTypes.LOAD_TUPLES_REQUEST_FAILURE, payload: error, error: true },
    ];

    const store = mockStore();

    return store.dispatch(loadTuples(url)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('dispatches LOAD_TUPLES_REQUEST_FAILED event when HTTP request fails', () => {
    const url = 'https://foo';
    const error = new Error('Unknown Error');

    fetchMock.getOnce('*', {
      throws: error,
    });

    const expectedActions = [
      { type: ActionTypes.LOAD_TUPLES_REQUEST, payload: url },
      { type: ActionTypes.LOAD_TUPLES_REQUEST_FAILURE, payload: error, error: true },
    ];

    const store = mockStore();

    return store.dispatch(loadTuples(url)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
