import { ThunkAction } from 'redux-thunk';
import { GraphState, GraphSource, Quad } from './model';
import JsonLdParser from './parser/JsonLdParser';

export enum ActionTypes {
  LOAD_RDF_REQUEST = 'LOAD_RDF_REQUEST',
  LOAD_RDF_REQUEST_SUCCESS = 'LOAD_RDF_REQUEST_SUCCESS',
  LOAD_RDF_REQUEST_FAILURE = 'LOAD_RDF_REQUEST_FAILURE',
  LOAD_RDF_COMPLETED = 'LOAD_RDF_COMPLETED',
}

const loadRdfRequest = (source: GraphSource) => ({
  type: ActionTypes.LOAD_RDF_REQUEST,
  payload: source,
});

const loadRdfRequestSuccess = (quads: Quad[]) => ({
  type: ActionTypes.LOAD_RDF_REQUEST_SUCCESS,
  payload: quads,
});

const loadRdfRequestFailure = (err: Error) => ({
  type: ActionTypes.LOAD_RDF_REQUEST_FAILURE,
  payload: err,
});

const loadRdfCompleted = () => ({
  type: ActionTypes.LOAD_RDF_COMPLETED,
});

export type LoadRdfResult = {
  (sources: GraphSource[]): ThunkAction<Promise<void>, GraphState, null>;
};

const parser = new JsonLdParser();

export const loadRdf: LoadRdfResult = (sources: GraphSource[]) => {
  return (dispatch) => {
    const opts = {
      headers: {
        Accept: 'application/ld+json',
      },
    };

    return Promise.all(sources.map((source) => {
      dispatch(loadRdfRequest(source));

      return fetch(source.url, opts)
        .then(response => response.json())
        .then(doc => parser.parse(doc, source.graph))
        .then((quads) => {
          dispatch(loadRdfRequestSuccess(quads));
        })
        .catch((err) => {
          dispatch(loadRdfRequestFailure(err));
        });
    })).then(() => {
      dispatch(loadRdfCompleted());
    });
  };
};
