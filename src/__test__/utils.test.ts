import { sortRows } from '../utils';
import { objectTest1, objectTest2, literal1, literal2 } from './TestData';

describe('utils::sortRows', () => {
  it('Sorts properly asc up NamedNode', () => {
    expect(sortRows({ test: objectTest1 }, { test: objectTest2 }, 'asc', 'test')).toEqual(-1);
  });
  it('Sorts properly asc down NamedNode', () => {
    expect(sortRows({ test: objectTest2 }, { test: objectTest1 }, 'asc', 'test')).toEqual(1);
  });
  it('Sorts properly desc down NamedNode', () => {
    expect(sortRows({ test: objectTest1 }, { test: objectTest2 }, 'desc', 'test')).toEqual(1);
  });
  it('Sorts properly desc up NamedNode', () => {
    expect(sortRows({ test: objectTest2 }, { test: objectTest1 }, 'desc', 'test')).toEqual(-1);
  });
  it('Sorts properly desc when equal NamedNode', () => {
    expect(sortRows({ test: objectTest1 }, { test: objectTest1 }, 'desc', 'test')).toEqual(-0);
  });
  it('Sorts properly asc when equal NamedNode', () => {
    expect(sortRows({ test: objectTest1 }, { test: objectTest1 }, 'asc', 'test')).toEqual(0);
  });
  it('Sorts properly asc up Literal', () => {
    expect(sortRows({ test: literal1 }, { test: literal2 }, 'asc', 'test')).toEqual(-1);
  });
  it('Sorts properly asc down Literal', () => {
    expect(sortRows({ test: literal2 }, { test: literal1 }, 'asc', 'test')).toEqual(1);
  });
  it('Sorts properly desc down Literal', () => {
    expect(sortRows({ test: literal1 }, { test: literal2 }, 'desc', 'test')).toEqual(1);
  });
  it('Sorts properly desc up Literal', () => {
    expect(sortRows({ test: literal2 }, { test: literal1 }, 'desc', 'test')).toEqual(-1);
  });
  it('Sorts properly desc when equal Literal', () => {
    expect(sortRows({ test: literal1 }, { test: literal1 }, 'desc', 'test')).toEqual(-0);
  });
  it('Sorts properly asc when equal Literal', () => {
    expect(sortRows({ test: literal1 }, { test: literal1 }, 'asc', 'test')).toEqual(0);
  });
  it('Sorts properly asc up Literal with NamedNode', () => {
    expect(sortRows({ test: literal1 }, { test: objectTest2 }, 'asc', 'test')).toEqual(-1);
  });
  it('Sorts properly asc down Literal with NamedNode', () => {
    expect(sortRows({ test: literal2 }, { test: objectTest1 }, 'asc', 'test')).toEqual(1);
  });
  it('Sorts properly desc down Literal with NamedNode', () => {
    expect(sortRows({ test: literal1 }, { test: objectTest2 }, 'desc', 'test')).toEqual(1);
  });
  it('Sorts properly desc up Literal with NamedNode', () => {
    expect(sortRows({ test: literal2 }, { test: objectTest1 }, 'desc', 'test')).toEqual(-1);
  });
  it('Sorts properly desc when equal Literal with NamedNode', () => {
    expect(sortRows({ test: literal1 }, { test: objectTest1 }, 'desc', 'test')).toEqual(-0);
  });
  it('Sorts properly asc when equal Literal with NamedNode', () => {
    expect(sortRows({ test: literal1 }, { test: objectTest1 }, 'asc', 'test')).toEqual(0);
  });
});
