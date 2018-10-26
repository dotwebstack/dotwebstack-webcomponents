import { TupleResult, SparqlResponse } from '../../lib/TupleResult';
import fetchMock from 'fetch-mock';
import { mockResponse, mockResultSet } from '../TestData';
import { fetchSparqlResult } from '../../utils';

describe('TupleResult', () => {
  fetchMock.mock('http://example.org', mockResponse);
  fetchMock.mock('http://example1.org', {});

  it('sets bindingNames properly', async () => {
    let dataResponse: SparqlResponse = { head: { vars:[] }, results: { bindings: [] } };
    await fetchSparqlResult('http://example.org').then((data) => {
      dataResponse = data;
    });
    const tupleResult = new TupleResult(dataResponse);
    expect(tupleResult.getBindingNames()).toEqual(['book', 'title']);
  });

  it('sets bindingSets properly', async () => {
    let dataResponse: SparqlResponse = { head: { vars:[] }, results: { bindings: [] } };
    await fetchSparqlResult('http://example.org').then((data) => {
      dataResponse = data;
    });
    const tupleResult = new TupleResult(dataResponse);
    expect(tupleResult.getBindingSets()).toEqual(mockResultSet);
  });

  it('return empty when no data provided', async () => {
    const tupleResult = new TupleResult();
    expect(tupleResult.getBindingSets()).toEqual([]);
    expect(tupleResult.getBindingNames()).toEqual([]);
  });
});
