import DataFactory from '../DataFactory';
import graphReducer from '../graphReducer';
import { ActionTypes, loadRdfRequest, loadRdfCompleted, loadRdfRequestSuccess } from '../actions';
import { GraphState } from '../model';

const dataFactory = new DataFactory();

describe(`graphReducer:${ActionTypes.LOAD_RDF_REQUEST}`, () => {
  test('sets loading to true', () => {
    const url = 'http://foo';
    const state = graphReducer(undefined, loadRdfRequest(url));

    expect(state.loading).toEqual(true);
  });
});

describe(`graphReducer:${ActionTypes.LOAD_RDF_REQUEST_SUCCESS}`, () => {
  test('adds quads to the internal store', () => {
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

    const prevState: GraphState = { loading: true, quads: [fooQuad] };
    const state = graphReducer(prevState, loadRdfRequestSuccess([barQuad]));

    expect(state.quads).toEqual([fooQuad, barQuad]);
  });
});

describe(`graphReducer:${ActionTypes.LOAD_RDF_COMPLETED}`, () => {
  test('sets loading to false', () => {
    const prevState: GraphState = { loading: true, quads: [] };
    const state = graphReducer(prevState, loadRdfCompleted());

    expect(state.loading).toEqual(false);
  });
});

describe('graphReducer:other', () => {
  test('does not modify state', () => {
    const prevState: GraphState = { loading: true, quads: [] };
    const state = graphReducer(prevState, { type: 'OTHER' });

    expect(state).toEqual(prevState);
  });
});
