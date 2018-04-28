import { ThunkAction } from 'redux-thunk';
import { GraphState, GraphSource } from '.';
import JsonLdParser from '../JsonLdParser';
import Quad from '../Quad';

const parser = new JsonLdParser();

export const LOAD_RDF_REQUEST = 'LOAD_RDF_REQUEST';

export const LOAD_RDF_REQUEST_SUCCESS = 'LOAD_RDF_REQUEST_SUCCESS';

export const LOAD_RDF_REQUEST_FAILURE = 'LOAD_RDF_REQUEST_FAILURE';

export const LOAD_RDF_COMPLETED = 'LOAD_RDF_COMPLETED';

const loadRdfRequest = (source: GraphSource) => ({
  type: LOAD_RDF_REQUEST,
  payload: source,
});

const loadRdfRequestSuccess = (quads: Quad[]) => ({
  type: LOAD_RDF_REQUEST_SUCCESS,
  payload: quads,
});

const loadRdfRequestFailure = (err: Error) => ({
  type: LOAD_RDF_REQUEST_FAILURE,
  payload: err,
});

const loadRdfCompleted = () => ({
  type: LOAD_RDF_COMPLETED,
});

export type LoadRdfResult = {
  (sources: GraphSource[]): ThunkAction<Promise<void>, GraphState, null>;
};

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
