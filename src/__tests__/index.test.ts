import { getComponent, Label } from '../index';

describe('getComponent', () => {
  test('returns component when found', () => {
    const component = getComponent('Label');
    expect(component).toEqual(Label);
  });

  test('throws error when component not found', () => {
    expect(() => getComponent('Foo')).toThrowError();
  });
});
