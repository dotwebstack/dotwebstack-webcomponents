import React from 'react';
import { shallow } from 'enzyme';
import Value from '../../components/Value';
import { objectTest1 } from '../TestData';
import { localName } from '../../utils';

describe('<Value />', () => {
  it('constructs value with default settings', () => {
    const wrapper = shallow(
      <Value
        term={objectTest1}
      />);
    expect(wrapper.html()).toEqual(
      `<a href="${objectTest1.value}">${objectTest1.value}</a>`);
  });

  it('constructs value with local link title', () => {
    const wrapper = shallow(
      <Value
        term={objectTest1}
        local={true}
      />);
    expect(wrapper.html()).toEqual(
      `<a href="${objectTest1.value}">${localName(objectTest1)}</a>`);
  });

  it('constructs value with custom linkBuilder', () => {
    const wrapper = shallow(
      <Value
        term={objectTest1}
        linkBuilder={(url: string) => url.concat('/foo')}
      />);
    expect(wrapper.html()).toEqual(
      `<a href="${objectTest1.value.concat('/foo')}">${objectTest1.value}</a>`);
  });
});
