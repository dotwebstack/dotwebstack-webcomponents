import { Dispatch } from 'redux';
import { FluxStandardAction, ErrorFluxStandardAction } from 'flux-standard-action';
import { BindingSet } from './model';
import SparqlResultsJsonParser from './parser/SparqlResultsJsonParser';

export enum ActionTypes {
  LOAD_TUPLES_REQUEST = 'LOAD_TUPLES_REQUEST',
  LOAD_TUPLES_REQUEST_SUCCESS = 'LOAD_TUPLES_REQUEST_SUCCESS',
  LOAD_TUPLES_REQUEST_FAILURE = 'LOAD_TUPLES_REQUEST_FAILURE',
}

export const loadTuplesRequest = (url: string): FluxStandardAction<string> => ({
  type: ActionTypes.LOAD_TUPLES_REQUEST,
  payload: url,
});

export const loadTuplesRequestSuccess = (bindingSets: BindingSet[]): FluxStandardAction<BindingSet[]> => ({
  type: ActionTypes.LOAD_TUPLES_REQUEST_SUCCESS,
  payload: bindingSets,
});

export const loadTuplesRequestFailure = (err: Error): ErrorFluxStandardAction<Error> => ({
  type: ActionTypes.LOAD_TUPLES_REQUEST_FAILURE,
  payload: err,
  error: true,
});

const sparqlResultsJsonParser = new SparqlResultsJsonParser();

export const loadTuples = (url: string) =>
  async (dispatch: Dispatch<ActionTypes>) => {
    const opts = {
      headers: {
        Accept: 'application/sparql-results+json',
      },
    };

    try {
      dispatch(loadTuplesRequest(url));

      const response = await fetch(
        url,
        opts,
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const jsonData = await response.json();
      const bindingSets = sparqlResultsJsonParser.parse(jsonData);

      dispatch(loadTuplesRequestSuccess(bindingSets));
    } catch (err) {
      dispatch(loadTuplesRequestFailure(err));
    }
  };
