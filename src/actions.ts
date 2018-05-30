import { Dispatch } from 'redux';
import { FluxStandardAction, ErrorFluxStandardAction } from 'flux-standard-action';
import { Quad, NamedNode, BindingSet } from './model';
import JsonLdParser from './parser/JsonLdParser';
import SparqlResultsJsonParser from './parser/SparqlResultsJsonParser';

export enum ActionTypes {
  LOAD_RDF_REQUEST = 'LOAD_RDF_REQUEST',
  LOAD_RDF_REQUEST_SUCCESS = 'LOAD_RDF_REQUEST_SUCCESS',
  LOAD_RDF_REQUEST_FAILURE = 'LOAD_RDF_REQUEST_FAILURE',
  LOAD_RDF_COMPLETED = 'LOAD_RDF_COMPLETED',
  LOAD_RDF_TUPLE_REQUEST = 'LOAD_RDF_TUPLE_REQUEST',
  LOAD_RDF_TUPLE_REQUEST_SUCCESS = 'LOAD_RDF_TUPLE_REQUEST_SUCCESS',
  LOAD_RDF_TUPLE_REQUEST_FAILURE = 'LOAD_RDF_TUPLE_REQUEST_FAILURE',
}

export const loadRdfRequest = (url: string): FluxStandardAction<string> => ({
  type: ActionTypes.LOAD_RDF_REQUEST,
  payload: url,
});

export const loadRdfRequestSuccess = (quads: Quad[]): FluxStandardAction<Quad[]> => ({
  type: ActionTypes.LOAD_RDF_REQUEST_SUCCESS,
  payload: quads,
});

export const loadRdfRequestFailure = (err: Error): ErrorFluxStandardAction<Error> => ({
  type: ActionTypes.LOAD_RDF_REQUEST_FAILURE,
  payload: err,
  error: true,
});

export const loadRdfCompleted = (): FluxStandardAction<undefined> => ({
  type: ActionTypes.LOAD_RDF_COMPLETED,
});

export const loadRdfTupleRequest = (url: string): FluxStandardAction<string> => ({
  type: ActionTypes.LOAD_RDF_TUPLE_REQUEST,
  payload: url,
});

export const loadRdfTupleRequestSuccess = (bindingSet: BindingSet[]): FluxStandardAction<BindingSet[]> => ({
  type: ActionTypes.LOAD_RDF_TUPLE_REQUEST_SUCCESS,
  payload: bindingSet,
});

export const loadRdfTupleRequestFailure = (err: Error): ErrorFluxStandardAction<Error> => ({
  type: ActionTypes.LOAD_RDF_TUPLE_REQUEST_FAILURE,
  payload: err,
  error: true,
});

const jsonLdParser = new JsonLdParser();

export const loadRdf = (src: NamedNode | NamedNode[]) =>
  async (dispatch: Dispatch<ActionTypes>) => {
    const opts = {
      headers: {
        Accept: 'application/ld+json',
      },
    };

    const urls: string[] = ([] as NamedNode[]).concat(src).map(s => s.value);

    await Promise.all(urls.map(async (url) => {
      try {
        dispatch(loadRdfRequest(url));

        const response = await fetch(
          url.replace(/^http:\/\//, 'https://'),
          opts,
        );

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const doc = await response.json();
        const quads = await jsonLdParser.parse(doc);

        dispatch(loadRdfRequestSuccess(quads));
      } catch (err) {
        dispatch(loadRdfRequestFailure(err));
      }
    }));

    dispatch(loadRdfCompleted());
  };

const sparqlResultsJsonParser = new SparqlResultsJsonParser();

export const loadRdfTuple = (url: string) =>
  async (dispatch: Dispatch<ActionTypes>) => {
    const opts = {
      headers: {
        Accept: 'application/sparql-results+json',
      },
    };

    try {
      dispatch(loadRdfTupleRequest(url));

      const response = await fetch(
        url,
        opts,
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const jsonData = await response.json();
      const bindingSet = await sparqlResultsJsonParser.parse(jsonData);

      dispatch(loadRdfTupleRequestSuccess(bindingSet));
    } catch (err) {
      dispatch(loadRdfTupleRequestFailure(err));
    }
  };
