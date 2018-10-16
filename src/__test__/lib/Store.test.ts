import Store from '../../lib/Store';
import { literal2, subject1, predicate1, predicate2,
  object1, object2, quadWithLiteral1, quadWithLiteral2, quadWith1,
   quadWithObject2, quadWithSubject2, quadWithPredicateObject2 } from '../TestData';
import { Quad } from 'rdf-js';

function createStore(quads: Quad[]) {
  return new Store(quads);
}

describe('Store::findStatements', () => {
  it('returns result when statement found', () => {
    const result = createStore([quadWithLiteral1]).findStatements(subject1);
    expect(result).toEqual([quadWithLiteral1]);
  });

  it('returns empty list when no statement found', () => {
    const result = createStore([quadWithLiteral2]).findStatements(literal2);
    expect(result).toEqual([]);
  });
});

describe('Store::findSubject', () => {
  it('returns result when subject found', () => {
    const result = createStore([quadWith1]).findSubjects(predicate1, object1);
    expect(result).toEqual([subject1]);
  });

  it('returns empty list when no subject found', () => {
    const result = createStore([quadWithObject2]).findSubjects(predicate1, object1);
    expect(result).toEqual([]);
  });

  it('returns multiple results when multiple objects are given', () => {
    const result = createStore([quadWith1, quadWithObject2])
    .findSubjects(predicate1, [object1, object2]);
    expect(result).toEqual([subject1, subject1]);
  });
});

describe('Store::findObject', () => {
  it('returns result when object found', () => {
    const result = createStore([quadWith1]).findObjects(subject1, predicate1);
    expect(result).toEqual([object1]);
  });

  it('returns empty list when no object found', () => {
    const result = createStore([quadWithSubject2]).findObjects(subject1, predicate1);
    expect(result).toEqual([]);
  });
  it('returns multiple results when multiple predicates are given', () => {
    const result = createStore([quadWith1, quadWithPredicateObject2])
    .findObjects(subject1, [predicate1, predicate2]);
    expect(result).toEqual([object1, object2]);
  });
});
