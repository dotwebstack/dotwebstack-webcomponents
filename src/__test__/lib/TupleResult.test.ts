import TupleResult, { SparqlResponse } from '../../lib/TupleResult';
import fetchMock from 'fetch-mock';
import { mockResponse, mockResultSet, mockResultSetBlanknode, mockResponseWithBlanknode, mockResultSetLanguage,
  mockResultSetDatatype, mockResponseWithLanguage, mockResponseWithDatatype, mockResponseWithDatatypeAndLanguage }
   from '../TestData';
import { fetchSparqlResult } from '../../utils';

let dataResponse: SparqlResponse = { head: { vars:[] }, results: { bindings: [] } };

describe('TupleResult', () => {
  fetchMock.mock('http://example.org', mockResponse);
  fetchMock.mock('http://example1.org', {});
  fetchMock.mock('http://exampleLanguage.org', mockResponseWithLanguage);
  fetchMock.mock('http://exampleDatatype.org', mockResponseWithDatatype);
  fetchMock.mock('http://exampleLangData.org', mockResponseWithDatatypeAndLanguage);
  fetchMock.mock('http://exampleBlanknode.org', mockResponseWithBlanknode);

  it('sets bindingNames properly', async () => {
    await fetchSparqlResult('http://example.org').then((data) => {
      dataResponse = data;
    });
    const tupleResult = new TupleResult(dataResponse);
    expect(tupleResult.getBindingNames()).toEqual(['book', 'title']);
  });

  it('creates bindingSets properly', async () => {
    await fetchSparqlResult('http://example.org').then((data) => {
      dataResponse = data;
    });
    const tupleResult = new TupleResult(dataResponse);
    expect(tupleResult.getBindingSets()).toEqual(mockResultSet);
  });

  it('creates literalnode with language properly', async () => {
    await fetchSparqlResult('http://exampleLanguage.org').then((data) => {
      dataResponse = data;
    });
    const tupleResult = new TupleResult(dataResponse);
    expect(tupleResult.getBindingSets()).toEqual(mockResultSetLanguage);
  });

  it('creates literalnode with datatype properly', async () => {
    await fetchSparqlResult('http://exampleDatatype.org').then((data) => {
      dataResponse = data;
    });
    const tupleResult = new TupleResult(dataResponse);
    expect(tupleResult.getBindingSets()).toEqual(mockResultSetDatatype);
  });

  it('creates literalnode with language and datatype properly', async () => {
    await fetchSparqlResult('http://exampleLangData.org').then((data) => {
      dataResponse = data;
    });
    const tupleResult = new TupleResult(dataResponse);
    expect(tupleResult.getBindingSets()).toEqual(mockResultSetLanguage);
  });

  it('creates blank node properly', async () => {
    await fetchSparqlResult('http://exampleBlanknode.org').then((data) => {
      dataResponse = data;
    });
    const tupleResult = new TupleResult(dataResponse);
    expect(tupleResult.getBindingSets()).toEqual(mockResultSetBlanknode);
  });

  it('return empty when no data provided', async () => {
    const tupleResult = new TupleResult();
    expect(tupleResult.getBindingSets()).toEqual([]);
    expect(tupleResult.getBindingNames()).toEqual([]);
  });
});
