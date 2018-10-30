import { shallow } from 'enzyme';
import { Quad } from 'rdf-js';
import React from 'react';
import ClassList from '../../components/ClassList';
import Store from '../../lib/Store';
import {
  literal1,
  objectTest1, objectTest2, objectTest4, quadWithDCSubject, quadWithDefinition,
  quadWithDefintionLiteral, quadWithLabelLiteral, quadWithPath, quadWithPathToObject2,
  quadWithPredicate2, quadWithProperty, quadWithReversedProperty, quadWithReversedTargetClass,
  quadWithSubClass, quadWithSuperClass, quadWithTargetClass, subjectTest5,
} from '../TestData';
import { localName } from '../../utils';
import TermValue from '../../components/TermValue';

describe('<ClassList />', () => {
  it('shows class IRI when nothing else provided', () => {
    const wrapper = shallow(
      <ClassList
        classIris={[objectTest1]}
        propertyIris={[]}
        store={createStore([])}
      />);
    expect(wrapper.find({ href: objectTest1.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows linked definition when found', () => {
    const wrapper = shallow(
      <ClassList
        classIris={[subjectTest5]}
        propertyIris={[]}
        store={createStore([quadWithDefintionLiteral])}
      />);
    expect(wrapper.find('p').text()).toEqual(quadWithDefintionLiteral.object.value);
  });

  it('shows linked subject definition when no linked definition found', () => {
    const wrapper = shallow(
      <ClassList
        classIris={[subjectTest5]}
        propertyIris={[]}
        store={createStore([quadWithDCSubject, quadWithDefinition])}
      />);
    expect(wrapper.find('p').text()).toEqual(quadWithDefinition.object.value);
  });

  it('shows superclass when found', () => {
    const wrapper = shallow(
      <ClassList
        classIris={[objectTest4]}
        propertyIris={[objectTest2]}
        store={createStore([quadWithPredicate2, quadWithLabelLiteral, quadWithSuperClass])}
      />);
    expect(wrapper.find({ href: quadWithSuperClass.subject.value }).getElements().length)
      .toBeGreaterThan(0);
    expect(wrapper.find({ href: quadWithLabelLiteral.subject.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows subclass when found', () => {
    const wrapper = shallow(
      <ClassList
        classIris={[objectTest4]}
        propertyIris={[objectTest2]}
        store={createStore([quadWithPredicate2, quadWithLabelLiteral, quadWithSubClass])}
      />);
    expect(wrapper.find({ href: objectTest4.value }).getElements().length)
      .toBeGreaterThan(0);
    expect(wrapper.find({ href: subjectTest5.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows properties when properly linked', () => {
    const wrapper = shallow(
      <ClassList
        classIris={[objectTest4]}
        propertyIris={[objectTest2]}
        store={createStore([quadWithTargetClass, quadWithProperty, quadWithPath])}
      />);
    expect(wrapper.find({ href: '#' + localName(quadWithPath.object) }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows inherited properties when found', () => {
    const wrapper = shallow(
      <ClassList
        classIris={[objectTest4]}
        propertyIris={[]}
        store={createStore([quadWithSuperClass, quadWithReversedTargetClass,
          quadWithReversedProperty, quadWithPathToObject2])}
      />);
    expect(wrapper.find({ href: quadWithPathToObject2.object.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('constructs local link', () => {
    const wrapper = shallow(
      <TermValue
        term={objectTest1}
        local={true}
      />);
    expect(wrapper.html()).toMatch('#test1');
    expect(wrapper.find({ href: '#test1' }).getElements().length).toBeGreaterThan(0);
    expect(wrapper.text()).toEqual('test1');
  });

  it('constructs remote link', () => {
    const wrapper = shallow(
      <TermValue
        term={objectTest1}
        local={false}
      />);
    expect(wrapper.html()).toMatch('http://example.org/test1');
    expect(wrapper.find({ href: 'http://example.org/test1' }).getElements().length).toBeGreaterThan(0);
    expect(wrapper.text()).toEqual('test1');
  });

  it('constructs TermValue with Literal', () => {
    const wrapper = shallow(
      <TermValue
        term={literal1}
        local={true}
      />);
    expect(wrapper.html()).toMatch('<span>test</span>');
    expect(wrapper.text()).toEqual('test');
  });
});

function createStore(quads: Quad[]) {
  return new Store(quads);
}
