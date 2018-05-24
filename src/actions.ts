import { ThunkAction } from 'redux-thunk';
import { GraphState, Quad, NamedNode } from './model';
import JsonLdParser from './parser/JsonLdParser';

export enum ActionTypes {
  LOAD_RDF_REQUEST = 'LOAD_RDF_REQUEST',
  LOAD_RDF_REQUEST_SUCCESS = 'LOAD_RDF_REQUEST_SUCCESS',
  LOAD_RDF_REQUEST_FAILURE = 'LOAD_RDF_REQUEST_FAILURE',
  LOAD_RDF_COMPLETED = 'LOAD_RDF_COMPLETED',
}

const loadRdfRequest = (url: string) => ({
  type: ActionTypes.LOAD_RDF_REQUEST,
  payload: url,
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
  (src: NamedNode | NamedNode[]): ThunkAction<Promise<void>, GraphState, null>;
};

const parser = new JsonLdParser();

export const loadRdf: LoadRdfResult = (src: NamedNode | NamedNode[]) => (dispatch) => {
  const opts = {
    headers: {
      Accept: 'application/ld+json',
    },
  };

  const urls: string[] = ([] as NamedNode[]).concat(src).map(s => s.value);

  return Promise.all(urls.map((url) => {
    dispatch(loadRdfRequest(url));

    return fetch(url, opts)
      .then(response => response.json())
      .then(doc => parser.parse(doc))
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
