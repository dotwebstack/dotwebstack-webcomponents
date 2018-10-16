import Store from '../../lib/Store';
import { literal2, namedNodeSubject1, namedNodePredicate1, namedNodePredicate2,
  namedNodeObject1, namedNodeObject2, quadWithLiteral1, quadWithLiteral2, quadWith1,
   quadWithObject2, quadWithSubject2, quadWithPredicateObject2 } from '../TestData';

describe('Store::findStatements', () => {
  it('returns result when statement found', () => {
    const store = new Store([quadWithLiteral1]);
    const result = store.findStatements(namedNodeSubject1);
    expect(result).toEqual([quadWithLiteral1]);
  });

  it('returns empty list when no statement found', () => {
    const store = new Store([quadWithLiteral2]);
    const result = store.findStatements(literal2);
    expect(result).toEqual([]);
  });
});

describe('Store::findSubject', () => {
  it('returns result when subject found', () => {
    const store = new Store([quadWith1]);
    const result = store.findSubjects(namedNodePredicate1, namedNodeObject1);
    expect(result).toEqual([namedNodeSubject1]);
  });

  it('returns empty list when no subject found', () => {
    const store = new Store([quadWithObject2]);
    const result = store.findSubjects(namedNodePredicate1, namedNodeObject1);
    expect(result).toEqual([]);
  });

  it('returns multiple results when multiple objects are given', () => {
    const store = new Store([quadWith1, quadWithObject2]);
    const result = store.findSubjects(namedNodePredicate1, [namedNodeObject1, namedNodeObject2]);
    expect(result).toEqual([namedNodeSubject1, namedNodeSubject1]);
  });
});

describe('Store::findObject', () => {
  it('returns result when object found', () => {
    const store = new Store([quadWith1]);
    const result = store.findObjects(namedNodeSubject1, namedNodePredicate1);
    expect(result).toEqual([namedNodeObject1]);
  });

  it('returns empty list when no object found', () => {
    const store = new Store([quadWithSubject2]);
    const result = store.findObjects(namedNodeSubject1, namedNodePredicate1);
    expect(result).toEqual([]);
  });
  it('returns multiple results when multiple predicates are given', () => {
    const store = new Store([quadWith1, quadWithPredicateObject2]);
    const result = store.findObjects(namedNodeSubject1, [namedNodePredicate1, namedNodePredicate2]);
    expect(result).toEqual([namedNodeObject1, namedNodeObject2]);
  });
});
