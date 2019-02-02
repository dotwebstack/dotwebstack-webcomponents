import { sortRows, findComment, findDefinition } from '../utils';
import { objectTest1, objectTest2, literal1, literal2, quadWithCommentLiteral, quadWithDefinitionLiteral,
  quadWithDCSubjectDefinitionLiteral, quadWithDCSubject} from './TestData';
import Store from '../lib/Store';

describe('utils::sortRows', () => {
  it('Sorts properly asc up NamedNode', () => {
    expect(sortRows({ test: objectTest1 }, { test: objectTest2 }, true, 'test')).toEqual(-1);
  });

  it('Sorts properly asc down NamedNode', () => {
    expect(sortRows({ test: objectTest2 }, { test: objectTest1 }, true, 'test')).toEqual(1);
  });

  it('Sorts properly desc down NamedNode', () => {
    expect(sortRows({ test: objectTest1 }, { test: objectTest2 }, false, 'test')).toEqual(1);
  });

  it('Sorts properly desc up NamedNode', () => {
    expect(sortRows({ test: objectTest2 }, { test: objectTest1 }, false, 'test')).toEqual(-1);
  });

  it('Sorts properly desc when equal NamedNode', () => {
    expect(sortRows({ test: objectTest1 }, { test: objectTest1 }, false, 'test')).toEqual(-0);
  });

  it('Sorts properly asc when equal NamedNode', () => {
    expect(sortRows({ test: objectTest1 }, { test: objectTest1 }, true, 'test')).toEqual(0);
  });

  it('Sorts properly asc up Literal', () => {
    expect(sortRows({ test: literal1 }, { test: literal2 }, true, 'test')).toEqual(-1);
  });

  it('Sorts properly asc down Literal', () => {
    expect(sortRows({ test: literal2 }, { test: literal1 }, true, 'test')).toEqual(1);
  });

  it('Sorts properly desc down Literal', () => {
    expect(sortRows({ test: literal1 }, { test: literal2 }, false, 'test')).toEqual(1);
  });

  it('Sorts properly desc up Literal', () => {
    expect(sortRows({ test: literal2 }, { test: literal1 }, false, 'test')).toEqual(-1);
  });

  it('Sorts properly desc when equal Literal', () => {
    expect(sortRows({ test: literal1 }, { test: literal1 }, false, 'test')).toEqual(-0);
  });

  it('Sorts properly asc when equal Literal', () => {
    expect(sortRows({ test: literal1 }, { test: literal1 }, true, 'test')).toEqual(0);
  });

  it('Sorts properly asc up Literal with NamedNode', () => {
    expect(sortRows({ test: literal1 }, { test: objectTest2 }, true, 'test')).toEqual(-1);
  });

  it('Sorts properly asc down Literal with NamedNode', () => {
    expect(sortRows({ test: literal2 }, { test: objectTest1 }, true, 'test')).toEqual(1);
  });

  it('Sorts properly desc down Literal with NamedNode', () => {
    expect(sortRows({ test: literal1 }, { test: objectTest2 }, false, 'test')).toEqual(1);
  });

  it('Sorts properly desc up Literal with NamedNode', () => {
    expect(sortRows({ test: literal2 }, { test: objectTest1 }, false, 'test')).toEqual(-1);
  });

  it('Sorts properly desc when equal Literal with NamedNode', () => {
    expect(sortRows({ test: literal1 }, { test: objectTest1 }, false, 'test')).toEqual(-0);
  });

  it('Sorts properly asc when equal Literal with NamedNode', () => {
    expect(sortRows({ test: literal1 }, { test: objectTest1 }, true, 'test')).toEqual(0);
  });
});

describe('utils::findComment', () => {
  it('Returns the comment literal when found.', () => {
    const store = new Store([quadWithCommentLiteral]);
    expect(findComment(quadWithCommentLiteral.subject, store)).toEqual(quadWithCommentLiteral.object);
  });

  it('Returns undefined when not found.', () => {
    const store = new Store([]);
    expect(findComment(quadWithCommentLiteral.subject, store)).toBeUndefined();
  });
});

describe('utils::findDefinition', () => {
  it('Returns the definition literal when found.', () => {
    const store = new Store([quadWithDefinitionLiteral]);
    expect(findDefinition(quadWithDefinitionLiteral.subject, store)).toEqual(quadWithDefinitionLiteral.object);
  });

  it('Returns the definition literal when found on the related subject.', () => {
    const store = new Store([quadWithDCSubject, quadWithDCSubjectDefinitionLiteral]);
    expect(findDefinition(quadWithDCSubject.subject, store)).toEqual(quadWithDCSubjectDefinitionLiteral.object);
  });

  it('Returns undefined when both not found.', () => {
    const store = new Store([]);
    expect(findDefinition(quadWithCommentLiteral.subject, store)).toBeUndefined();
  });
});
