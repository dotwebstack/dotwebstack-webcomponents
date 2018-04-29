import DataFactory from '../DataFactory';
import { Literal, BlankNode, NamedNode, DefaultGraph } from '../term';
import Quad from '../Quad';

const dataFactory = new DataFactory();

describe('DataFactory::namedNode', () => {
  it('should factor a named node', () => {
    const node = dataFactory.namedNode('foo');
    expect(node).toBeInstanceOf(NamedNode);
    expect(node.value).toEqual('foo');
  });
});

describe('DataFactory::blankNode', () => {
  it('should factor a blank node', () => {
    const node = dataFactory.blankNode('foo');
    expect(node).toBeInstanceOf(BlankNode);
    expect(node.value).toEqual('foo');
  });
});

describe('DataFactory::literal', () => {
  it('should factor a string literal without language by default', () => {
    const dataType = dataFactory.namedNode('http://www.w3.org/2001/XMLSchema#string');
    const node = dataFactory.literal('foo');
    expect(node).toBeInstanceOf(Literal);
    expect(node.value).toEqual('foo');
    expect(node.language).toEqual('');
    expect(node.dataType.equals(dataType));
  });

  it('should factor a string literal with language when second argument is string', () => {
    const dataType = dataFactory.namedNode('http://www.w3.org/2001/XMLSchema#string');
    const node = dataFactory.literal('foo', 'en_US');
    expect(node).toBeInstanceOf(Literal);
    expect(node.value).toEqual('foo');
    expect(node.language).toEqual('en_US');
    expect(node.dataType.equals(dataType));
  });

  it('should factor a literal with custom data type when second argument is named node', () => {
    const dataType = dataFactory.namedNode('http://www.w3.org/2001/XMLSchema#integer');
    const node = dataFactory.literal('123', dataType);
    expect(node).toBeInstanceOf(Literal);
    expect(node.value).toEqual('123');
    expect(node.language).toEqual('');
    expect(node.dataType.equals(dataType));
  });
});

describe('DataFactory::defaultGraph', () => {
  it('should factor a default graph', () => {
    const node = dataFactory.defaultGraph();
    expect(node).toBeInstanceOf(DefaultGraph);
  });
});

describe('DataFactory::triple', () => {
  it('should factor a quad in the default graph', () => {
    const s = dataFactory.namedNode('foo');
    const p = dataFactory.namedNode('bar');
    const o = dataFactory.namedNode('baz');
    const node = dataFactory.triple(s, p, o);
    expect(node).toBeInstanceOf(Quad);
    expect(node.subject).toEqual(s);
    expect(node.predicate).toEqual(p);
    expect(node.object).toEqual(o);
    expect(node.graph).toBeInstanceOf(DefaultGraph);
  });
});

describe('DataFactory::quad', () => {
  it('should factor a quad in the default graph by default', () => {
    const s = dataFactory.namedNode('foo');
    const p = dataFactory.namedNode('bar');
    const o = dataFactory.namedNode('baz');
    const node = dataFactory.quad(s, p, o);
    expect(node).toBeInstanceOf(Quad);
    expect(node.subject).toEqual(s);
    expect(node.predicate).toEqual(p);
    expect(node.object).toEqual(o);
    expect(node.graph).toBeInstanceOf(DefaultGraph);
  });

  it('should factor a quad in a named graph when passed', () => {
    const s = dataFactory.namedNode('foo');
    const p = dataFactory.namedNode('bar');
    const o = dataFactory.namedNode('baz');
    const g = dataFactory.namedNode('qux');
    const node = dataFactory.quad(s, p, o, g);
    expect(node).toBeInstanceOf(Quad);
    expect(node.subject).toEqual(s);
    expect(node.predicate).toEqual(p);
    expect(node.object).toEqual(o);
    expect(node.graph).toEqual(g);
  });
});
