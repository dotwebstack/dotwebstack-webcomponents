import { sortRows } from '../utils';
import { objectTest1, objectTest2 } from './TestData';

describe('utils::sortRows', () => {
  it('Sorts properly asc up', () => {
    expect(sortRows({ test: objectTest1 }, { test: objectTest2 }, 'asc', 'test')).toEqual(-1);
  });
  it('Sorts properly asc down', () => {
    expect(sortRows({ test: objectTest2 }, { test: objectTest1 }, 'asc', 'test')).toEqual(1);
  });
  it('Sorts properly desc down', () => {
    expect(sortRows({ test: objectTest1 }, { test: objectTest2 }, 'desc', 'test')).toEqual(1);
  });
  it('Sorts properly desc up', () => {
    expect(sortRows({ test: objectTest2 }, { test: objectTest1 }, 'desc', 'test')).toEqual(-1);
  });
  it('Sorts properly desc when equal', () => {
    expect(sortRows({ test: objectTest1 }, { test: objectTest1 }, 'desc', 'test')).toEqual(-0);
  });
  it('Sorts properly asc when equal', () => {
    expect(sortRows({ test: objectTest1 }, { test: objectTest1 }, 'asc', 'test')).toEqual(0);
  });
});
