import SparqlResultsJsonParser from '../../parser/SparqlResultsJsonParser';
import DataFactory from '../../DataFactory';

const parser = new SparqlResultsJsonParser();
const dataFactory = new DataFactory();

describe('SparqlResultsJson::parse', () => {
  it('returns an empty array when result is empty', async () => {
    const bindingSets = await parser.parse({
      results: { bindings: [] },
    });

    expect(bindingSets).toHaveLength(0);
  });

  it('parses named and blank nodes', async () => {
    const bindingSets = await parser.parse({
      results: { bindings: [
        {
          foo: { type: 'uri', value: 'http://foo' },
          bar: { type: 'bnode', value: 'bar' },
        },
      ]},
    });

    expect(bindingSets).toHaveLength(1);
    expect(bindingSets[0].foo).toEqual(dataFactory.namedNode('http://foo'));
    expect(bindingSets[0].bar).toEqual(dataFactory.blankNode('bar'));
  });

  it('parses literals with and without datatype', async () => {
    const bindingSets = await parser.parse({
      results: { bindings: [
        {
          foo: { type: 'literal', value: 'foo' },
          bar: { type: 'literal', value: 'true', datatype: 'http://www.w3.org/2001/XMLSchema#boolean' },
        },
      ]},
    });

    expect(bindingSets).toHaveLength(1);
    expect(bindingSets[0].foo).toEqual(dataFactory.literal('foo'));
    expect(bindingSets[0].bar).toEqual(dataFactory.literal('true',
      dataFactory.namedNode('http://www.w3.org/2001/XMLSchema#boolean')));
  });

  it('parses literals with and without language', async () => {
    const bindingSets = await parser.parse({
      results: { bindings: [
        {
          foo: { type: 'literal', value: 'foo' },
          bar: { type: 'literal', value: 'true', 'xml:lang': 'en' },
        },
      ]},
    });

    expect(bindingSets).toHaveLength(1);
    expect(bindingSets[0].foo).toEqual(dataFactory.literal('foo'));
    expect(bindingSets[0].bar).toEqual(dataFactory.literal('true', 'en'));
  });

  it('fails when document is not valid', async () => {
    expect.assertions(1);
    await expect(parser.parse({
      // @ts-ignore
      foo: 'bar',
    })).rejects.toThrowError();
  });

  it('fails when bindings is not an array', async () => {
    expect.assertions(1);
    // @ts-ignore
    await expect(parser.parse({
      results: { bindings: 'foo' },
    })).rejects.toThrowError();
  });

  it('fails when binding type is invalid', async () => {
    expect.assertions(1);
    // @ts-ignore
    await expect(parser.parse({
      results: { bindings: [
        {
          foo: { type: 'foo', value: 'bar' },
        },
      ]},
    })).rejects.toThrowError();
  });
});
