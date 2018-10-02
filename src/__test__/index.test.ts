import { getComponent, ConceptList, GraphProvider, GraphConsumer } from '../index';
import Vocabulary from '../containers/Vocabulary';
import Resource from '../components/Resource';

describe('index::getComponent', () => {
  it('returns component when found', () => {
    expect(() => getComponent('ConceptList').toEqual(ConceptList));
    expect(() => getComponent('GraphConsumer').toEqual(GraphConsumer));
    expect(() => getComponent('GraphProvider').toEqual(GraphProvider));
    expect(() => getComponent('Resource').toEqual(Resource));
    expect(() => getComponent('Vocabulary').toEqual(Vocabulary));
  });

  it('throws error when component not found', () => {
    expect(() => getComponent('Foo')).toThrowError();
  });
});
