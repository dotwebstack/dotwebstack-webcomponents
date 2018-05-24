import { getComponent, Label } from '../index';

describe('index:getComponent', () => {
  test('returns component when 0found', () => {
    const component = getComponent('Label');
    expect(component).toEqual(Label);
  });

  test('throws error when component not found', () => {
    expect(() => getComponent('Foo')).toThrowError();
  });
});
