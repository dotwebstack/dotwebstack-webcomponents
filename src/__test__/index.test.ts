import { getComponent, ConceptList, GraphContext, Resource, Vocabulary } from '../index';

describe('index::getComponent', () => {
  it('returns component when found', () => {
    expect(() => getComponent('ConceptList').toEqual(ConceptList));
    expect(() => getComponent('GraphContext').toEqual(GraphContext));
    expect(() => getComponent('Resource').toEqual(Resource));
    expect(() => getComponent('Vocabulary').toEqual(Vocabulary));
  });

  it('throws error when component not found', () => {
    expect(() => getComponent('Foo')).toThrowError();
  });
});
