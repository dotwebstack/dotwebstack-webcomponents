import { getComponent, Label } from '../index';

describe('index::getComponent', () => {
  it('returns component when found', () => {
    const component = getComponent('Label');
    expect(component).toEqual(Label);
  });

  it('throws error when component not found', () => {
    expect(() => getComponent('Foo')).toThrowError();
  });
});
