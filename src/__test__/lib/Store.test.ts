import Store from '../../lib/Store';
import { literal2, subjectTypeRdf, predicatePropertyRdf, predicateType,
  objectConceptSkos, objectTest1, quadWithLiteral1, quadWithLiteral2, quadWith1,
   quadWithObject2, quadWithSubject2, quadWithPredicateObject2 } from '../TestData';
import { Quad } from 'rdf-js';

function createStore(quads: Quad[]) {
  return new Store(quads);
}

describe('Store::findStatements', () => {
  it('returns result when statement found', () => {
    const result = createStore([quadWithLiteral1]).findStatements(subjectTypeRdf);
    expect(result).toEqual([quadWithLiteral1]);
  });

  it('returns empty list when no statement found', () => {
    const result = createStore([quadWithLiteral2]).findStatements(literal2);
    expect(result).toEqual([]);
  });
});

describe('Store::findSubject', () => {
  it('returns result when subject found', () => {
    const result = createStore([quadWith1]).findSubjects(predicatePropertyRdf, objectConceptSkos);
    expect(result).toEqual([subjectTypeRdf]);
  });

  it('returns empty list when no subject found', () => {
    const result = createStore([quadWithObject2]).findSubjects(predicatePropertyRdf, objectConceptSkos);
    expect(result).toEqual([]);
  });

  it('returns multiple results when multiple objects are given', () => {
    const result = createStore([quadWith1, quadWithObject2])
    .findSubjects(predicatePropertyRdf, [objectConceptSkos, objectTest1]);
    expect(result).toEqual([subjectTypeRdf, subjectTypeRdf]);
  });
});

describe('Store::findObject', () => {
  it('returns result when object found', () => {
    const result = createStore([quadWith1]).findObjects(subjectTypeRdf, predicatePropertyRdf);
    expect(result).toEqual([objectConceptSkos]);
  });

  it('returns empty list when no object found', () => {
    const result = createStore([quadWithSubject2]).findObjects(subjectTypeRdf, predicatePropertyRdf);
    expect(result).toEqual([]);
  });
  it('returns multiple results when multiple predicates are given', () => {
    const result = createStore([quadWith1, quadWithPredicateObject2])
    .findObjects(subjectTypeRdf, [predicatePropertyRdf, predicateType]);
    expect(result).toEqual([objectConceptSkos, objectTest1]);
  });
});
