import DataFactory from './DataFactory';
import { Literal, BlankNode, NamedNode, DefaultGraph } from './term';
import Quad from './Quad';

const dataFactory = new DataFactory();

test('namedNode() factors a named node', () => {
  const node = dataFactory.namedNode('foo');
  expect(node).toBeInstanceOf(NamedNode);
  expect(node.value).toEqual('foo');
});

test('blankNode() factors a blank node', () => {
  const node = dataFactory.blankNode('foo');
  expect(node).toBeInstanceOf(BlankNode);
  expect(node.value).toEqual('foo');
});

test('literal() factors a string literal without language by default', () => {
  const dataType = dataFactory.namedNode('http://www.w3.org/2001/XMLSchema#string');
  const node = dataFactory.literal('foo');
  expect(node).toBeInstanceOf(Literal);
  expect(node.value).toEqual('foo');
  expect(node.language).toEqual('');
  expect(node.dataType.equals(dataType));
});

test('literal() factors a string literal with language when second argument is string', () => {
  const dataType = dataFactory.namedNode('http://www.w3.org/2001/XMLSchema#string');
  const node = dataFactory.literal('foo', 'en_US');
  expect(node).toBeInstanceOf(Literal);
  expect(node.value).toEqual('foo');
  expect(node.language).toEqual('en_US');
  expect(node.dataType.equals(dataType));
});

test('literal() factors a literal with custom data type when second argument is named node', () => {
  const dataType = dataFactory.namedNode('http://www.w3.org/2001/XMLSchema#integer');
  const node = dataFactory.literal('123', dataType);
  expect(node).toBeInstanceOf(Literal);
  expect(node.value).toEqual('123');
  expect(node.language).toEqual('');
  expect(node.dataType.equals(dataType));
});

test('defaultGraph() factors a default graph', () => {
  const node = dataFactory.defaultGraph();
  expect(node).toBeInstanceOf(DefaultGraph);
});

test('triple() factors a quad in the default graph', () => {
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

test('quad() factors a quad in the default graph by default', () => {
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

test('quad() factors a quad in a named graph when passed', () => {
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
