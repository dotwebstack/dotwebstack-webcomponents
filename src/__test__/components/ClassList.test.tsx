import { mount, shallow } from 'enzyme';
import { Quad } from 'rdf-js';
import React from 'react';
import ClassList from '../../components/ClassList';
import Store from '../../lib/Store';
import {
  objectTest1, objectTest2, objectTest4, quadWithDCSubject, quadWithDefinition,
  quadWithDefinitionLiteral, quadWithRdfsLabelLiteral, quadWithPath, quadWithPathToObject2,
  quadWithPredicate2, quadWithProperty, quadWithReversedProperty, quadWithReversedTargetClass,
  quadWithSubClass, quadWithSuperClass, quadWithTargetClass, subjectTest5, quadWithDomain,
} from '../TestData';
import { localName } from '../../utils';

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
        store={createStore([quadWithDefinitionLiteral])}
      />);
    expect(wrapper.find('p').text()).toEqual(quadWithDefinitionLiteral.object.value);
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
    const wrapper = mount(
      <ClassList
        classIris={[objectTest4]}
        propertyIris={[objectTest2]}
        store={createStore([quadWithPredicate2, quadWithRdfsLabelLiteral, quadWithSuperClass])}
      />);
    expect(wrapper.find({ href: quadWithSuperClass.subject.value }).getElements().length)
      .toBeGreaterThan(0);
    expect(wrapper.find({ href: quadWithRdfsLabelLiteral.subject.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows subclass when found', () => {
    const wrapper = mount(
      <ClassList
        classIris={[objectTest4]}
        propertyIris={[objectTest2]}
        store={createStore([quadWithPredicate2, quadWithRdfsLabelLiteral, quadWithSubClass])}
      />);
    expect(wrapper.find({ href: objectTest4.value }).getElements().length)
      .toBeGreaterThan(0);
    expect(wrapper.find({ href: subjectTest5.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows properties when properly linked with SHACL', () => {
    const wrapper = mount(
      <ClassList
        classIris={[objectTest4]}
        propertyIris={[objectTest2]}
        store={createStore([quadWithTargetClass, quadWithProperty, quadWithPath])}
      />);
    expect(wrapper.find({ href: '#' + localName(quadWithPath.object) }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows properties when properly linked with RDFS', () => {
    const wrapper = mount(
      <ClassList
        classIris={[objectTest1]}
        propertyIris={[subjectTest5]}
        store={createStore([quadWithDomain])}
      />);
    expect(wrapper.find({ href: '#' + localName(quadWithDomain.subject) }).getElements().length)
      .toEqual(1);
  });

  it('shows properties when properly linked with SHACL and RDFS', () => {
    const wrapper = mount(
      <ClassList
        classIris={[objectTest4, objectTest1]}
        propertyIris={[objectTest2, subjectTest5]}
        store={createStore([quadWithTargetClass, quadWithProperty, quadWithPath, quadWithDomain])}
      />);
    expect(wrapper.find({ href: '#' + localName(quadWithPath.object) }).getElements().length)
      .toEqual(1);
    expect(wrapper.find({ href: '#' + localName(quadWithDomain.subject) }).getElements().length)
      .toEqual(1);
  });

  it('shows inherited properties when found', () => {
    const wrapper = mount(
      <ClassList
        classIris={[objectTest4]}
        propertyIris={[]}
        store={createStore([quadWithSuperClass, quadWithReversedTargetClass,
          quadWithReversedProperty, quadWithPathToObject2])}
      />);
    expect(wrapper.find({ href: quadWithPathToObject2.object.value }).getElements().length)
      .toBeGreaterThan(0);
  });
});

function createStore(quads: Quad[]) {
  return new Store(quads);
}
