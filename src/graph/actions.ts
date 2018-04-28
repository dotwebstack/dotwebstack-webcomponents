import { ThunkAction } from 'redux-thunk';
import GraphState from './GraphState';
import JsonLdParser from '../JsonLdParser';
import Quad from '../Quad';
import { NamedNode, BlankNode, DefaultGraph } from '../term';

const parser = new JsonLdParser();

export const LOAD_RDF_REQUEST = 'LOAD_RDF_REQUEST';

export const LOAD_RDF_SUCCESS = 'LOAD_RDF_SUCCESS';

export const LOAD_RDF_FAILURE = 'LOAD_RDF_FAILURE';

const loadRdfRequest = (url: string, graph?: NamedNode | BlankNode | DefaultGraph) => ({
  type: LOAD_RDF_REQUEST,
  payload: {
    url,
    graph,
  },
});

const loadRdfSuccess = (quads: Quad[]) => ({
  type: LOAD_RDF_SUCCESS,
  payload: quads,
});

const loadRdfFailure = (err: Error) => ({
  type: LOAD_RDF_FAILURE,
  payload: err,
});

export type LoadRdfResult = {
  (url: string, graph?: NamedNode | BlankNode | DefaultGraph):
    ThunkAction<Promise<void>, GraphState, null>;
};

export const loadRdf: LoadRdfResult = (
    url: string,
    graph?: NamedNode | BlankNode | DefaultGraph) => {
  return (dispatch) => {
    dispatch(loadRdfRequest(url, graph));

    const opts = {
      headers: {
        Accept: 'application/ld+json',
      },
    };

    return fetch(url, opts)
      .then(response => response.json())
      .then(doc => parser.parse(doc, graph))
      .then((quads) => {
        dispatch(loadRdfSuccess(quads));
      })
      .catch((err) => {
        dispatch(loadRdfFailure(err));
      });
  };
};
