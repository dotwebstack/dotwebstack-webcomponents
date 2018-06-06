import DataFactory from '../DataFactory';
import tupleReducer from '../tupleReducer';
import { ActionTypes, loadTuplesRequest, loadTuplesRequestFailure, loadTuplesRequestSuccess } from '../actions';
import { TupleState } from '../model';

const dataFactory = new DataFactory();

const fooTuple =
  {
    begrip: dataFactory.namedNode('http://www.foo.nl/def#foo'),
    definition: dataFactory.literal('This is a Foo'),
    label: dataFactory.literal('Foo'),
  };

const barTuple =
  {
    begrip: dataFactory.namedNode('http://www.bar.nl/def#bar'),
    definition: dataFactory.literal('This is a Bar'),
    label: dataFactory.literal('Bar'),
  };

const prevState: TupleState = { loading: true, bindingSets: [fooTuple] };

describe(`tupleReducer::${ActionTypes.LOAD_TUPLES_REQUEST}`, () => {
  it('sets loading to true', () => {
    const url = 'http://foo';
    const state = tupleReducer(undefined, loadTuplesRequest(url));

    expect(state.loading).toBe(true);
  });
});

describe(`tupleReducer::${ActionTypes.LOAD_TUPLES_REQUEST_SUCCESS}`, () => {
  it('sets tuple in the internal store', () => {
    const state = tupleReducer(undefined, loadTuplesRequestSuccess([fooTuple]));

    expect(state.loading).toBe(false);
    expect(state.bindingSets).toContain(fooTuple);
  });

  it('replaces tuple in the internal store', () => {
    const state = tupleReducer(prevState, loadTuplesRequestSuccess([barTuple]));

    expect(state.loading).toBe(false);
    expect(state.bindingSets).not.toContain(fooTuple);
    expect(state.bindingSets).toContain(barTuple);
  });
});

describe(`tupleReducer::${ActionTypes.LOAD_TUPLES_REQUEST_FAILURE}`, () => {
  it('restores previous state in store', () => {
    const state = tupleReducer(prevState, loadTuplesRequestFailure(new Error('oops')));

    expect(state.loading).toBe(true);
    expect(state.bindingSets).toContain(fooTuple);
  });
});
