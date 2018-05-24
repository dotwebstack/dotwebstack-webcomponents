import { matchStatement, findStatements, findSingleStatement } from '../utils';
import DataFactory from '../DataFactory';

const dataFactory = new DataFactory();
const foo = dataFactory.namedNode('foo');
const bar = dataFactory.namedNode('bar');
const literal = dataFactory.literal("literal");

describe('utils:matchStatement', () => {
  test('renders true when subject is equal', () => {
    const match = matchStatement(foo);
    const isMatch = match(dataFactory.quad(foo, bar, literal));
    expect(isMatch).toEqual(true);
  });

  test('renders false when subject is not equal', () => {
    const match = matchStatement(bar);
    const isMatch = match(dataFactory.quad(foo, bar, literal));
    expect(isMatch).toEqual(false);
  });

  test('renders true when predicate is equal', () => {
    const match = matchStatement(undefined, bar);
    const isMatch = match(dataFactory.quad(foo, bar, literal));
    expect(isMatch).toEqual(true);
  });

  test('renders false when predicate is not equal', () => {
    const match = matchStatement(undefined, foo);
    const isMatch = match(dataFactory.quad(foo, bar, literal));
    expect(isMatch).toEqual(false);
  });

  test('renders true when subject and predicate are equal', () => {
    const match = matchStatement(foo, bar);
    const isMatch = match(dataFactory.quad(foo, bar, literal));
    expect(isMatch).toEqual(true);
  });

  test('renders false when subject and predicate are not equal', () => {
    const match = matchStatement(foo, bar);
    const isMatch = match(dataFactory.quad(bar, foo, literal));
    expect(isMatch).toEqual(false);
  });

  test('renders false when subject or predicate is not equal', () => {
    const match = matchStatement(foo, bar);
    const isMatch = match(dataFactory.quad(foo, foo, literal));
    expect(isMatch).toEqual(false);
  });
})

describe('utils:findStatements', () => {
  test('filters matching statements by subject', () => {
    const quads = [
      dataFactory.quad(foo, bar, literal),
      dataFactory.quad(bar, foo, literal),
    ];

    const matches = findStatements(quads, foo);

    expect(matches).toEqual([
      dataFactory.quad(foo, bar, literal),
    ]);
  });

  test('filters matching statements by predicate', () => {
    const quads = [
      dataFactory.quad(foo, bar, literal),
      dataFactory.quad(bar, foo, literal),
    ];

    const matches = findStatements(quads, undefined, bar);

    expect(matches).toEqual([
      dataFactory.quad(foo, bar, literal),
    ]);
  });

  test('filters matching statements by subject and predicate', () => {
    const quads = [
      dataFactory.quad(foo, bar, literal),
      dataFactory.quad(bar, foo, literal),
    ];

    const matches = findStatements(quads, foo, bar);

    expect(matches).toEqual([
      dataFactory.quad(foo, bar, literal),
    ]);
  });

  test('returns empty array when no matches are found', () => {
    const quads = [
      dataFactory.quad(foo, bar, literal),
      dataFactory.quad(bar, foo, literal),
    ];

    const matches = findStatements(quads, foo, foo);

    expect(matches).toEqual([]);
  });
});

describe('utils:findSingleStatement', () => {
  test('filters matching statement by subject', () => {
    const quads = [
      dataFactory.quad(foo, bar, literal),
      dataFactory.quad(bar, foo, literal),
    ];

    const match = findSingleStatement(quads, foo);

    expect(match).toEqual(
      dataFactory.quad(foo, bar, literal),
    );
  });

  test('filters matching statement by predicate', () => {
    const quads = [
      dataFactory.quad(foo, bar, literal),
      dataFactory.quad(bar, foo, literal),
    ];

    const match = findSingleStatement(quads, undefined, bar);

    expect(match).toEqual(
      dataFactory.quad(foo, bar, literal),
    );
  });

  test('filters matching statement by subject and predicate', () => {
    const quads = [
      dataFactory.quad(foo, bar, literal),
      dataFactory.quad(bar, foo, literal),
    ];

    const match = findSingleStatement(quads, foo, bar);

    expect(match).toEqual(
      dataFactory.quad(foo, bar, literal),
    );
  });

  test('returns undefined when not matches are found', () => {
    const quads = [
      dataFactory.quad(foo, bar, literal),
      dataFactory.quad(bar, foo, literal),
    ];

    const match = findSingleStatement(quads, foo, foo);

    expect(match).toBeUndefined();
  });
});
