import { Dispatch } from 'redux';
import { FSA, ErrorFSA } from 'flux-standard-action';
import { Quad, NamedNode } from './model';
import JsonLdParser from './parser/JsonLdParser';

export enum ActionTypes {
  LOAD_RDF_REQUEST = 'LOAD_RDF_REQUEST',
  LOAD_RDF_REQUEST_SUCCESS = 'LOAD_RDF_REQUEST_SUCCESS',
  LOAD_RDF_REQUEST_FAILURE = 'LOAD_RDF_REQUEST_FAILURE',
  LOAD_RDF_COMPLETED = 'LOAD_RDF_COMPLETED',
}

export const loadRdfRequest = (url: string): FSA<string> => ({
  type: ActionTypes.LOAD_RDF_REQUEST,
  payload: url,
});

export const loadRdfRequestSuccess = (quads: Quad[]): FSA<Quad[]> => ({
  type: ActionTypes.LOAD_RDF_REQUEST_SUCCESS,
  payload: quads,
});

export const loadRdfRequestFailure = (err: Error): ErrorFSA<Error> => ({
  type: ActionTypes.LOAD_RDF_REQUEST_FAILURE,
  payload: err,
  error: true,
});

export const loadRdfCompleted = (): FSA<undefined> => ({
  type: ActionTypes.LOAD_RDF_COMPLETED,
});

const parser = new JsonLdParser();

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

        const response = await fetch(url, opts);

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const doc = await response.json();
        const quads = await parser.parse(doc);

        dispatch(loadRdfRequestSuccess(quads));
      } catch (err) {
        dispatch(loadRdfRequestFailure(err));
      }
    }));

    dispatch(loadRdfCompleted());
  };
