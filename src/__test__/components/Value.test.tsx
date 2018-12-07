import { shallow } from 'enzyme';
import Value from '../../components/Value';
import { objectTest1, literal1 } from '../TestData';
import { linkBuilder } from '../../utils';
import React from 'react';

const linkbuilder = 'kadaster.nl';

describe('<Value />', () => {
  it('constructs Value without linkbuilder and local', () => {
    const wrapper = shallow(
      <Value
        term={objectTest1}
    />);
    expect(wrapper.html()).toMatch('<a href=\"' + objectTest1.value + '">' + objectTest1.value + '</a>');
    expect(wrapper.text()).toEqual(objectTest1.value);
  });

  it('constructs local link', () => {
    const wrapper = shallow(
      <Value
        term={objectTest1}
        local={true}
      />);
    expect(wrapper.html()).toMatch('#test1');
    expect(wrapper.find({ href: '#test1' }).getElements().length).toBeGreaterThan(0);
    expect(wrapper.text()).toEqual('test1');
  });

  it('constructs Value with Literal', () => {
    const wrapper = shallow(
      <Value
        term={literal1}
        linkBuilder={linkBuilder(literal1.value, linkbuilder)}
      />);
    expect(wrapper.html()).toMatch('<a href=\"kadaster.nltest1\">test1</a>');
    expect(wrapper.text()).toEqual(literal1.value);
  });

  it('constructs remote link', () => {
    const wrapper = shallow(
      <Value
        term={objectTest1}
        linkBuilder={linkBuilder(objectTest1.value, linkbuilder)}
        local={true}
      />);
    expect(wrapper.html()).toMatch('http://example.org/test1');
    expect(wrapper.find({ href: linkbuilder + 'http://example.org/test1' })
      .getElements().length).toBeGreaterThan(0);
    expect(wrapper.text()).toEqual('test1');
  });
});
