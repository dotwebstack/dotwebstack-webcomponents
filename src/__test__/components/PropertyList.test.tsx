import { mount, shallow } from 'enzyme';
import { Quad } from 'rdf-js';
import React from 'react';
import PropertyList from '../../components/PropertyList';
import Store from '../../lib/Store';
import {
  objectTest1, objectTest2, quadWithDCSubject,
  quadWithDefinition, quadWithDefinitionLiteral, quadWithSubProperty,
  quadWithSuperClass, quadWithSuperProperty, quadWithTargetClass, subjectTest5,
  quadWithPathToObject2, quadWithPropertyToSubject2, quadWithTargetClassFromObject5,
  quadWithClass,
} from '../TestData';

describe('<PropertyList />', () => {
  it('shows property IRI when nothing else provided', () => {
    const wrapper = shallow(
      <PropertyList
        classIris={[]}
        propertyIris={[objectTest1]}
        store={createStore([])}
        linkbuilder={objectTest1.value}
      />);
    expect(wrapper.find({ href: objectTest1.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows linked definition when found', () => {
    const wrapper = shallow(
      <PropertyList
        classIris={[]}
        propertyIris={[subjectTest5]}
        store={createStore([quadWithDefinitionLiteral])}
        linkbuilder={subjectTest5.value}
      />);
    expect(wrapper.find('p').text()).toEqual(quadWithDefinitionLiteral.object.value);
  });

  it('shows linked subject definition when no linked definition found', () => {
    const wrapper = shallow(
      <PropertyList
        classIris={[]}
        propertyIris={[subjectTest5]}
        store={createStore([quadWithDCSubject, quadWithDefinition])}
        linkbuilder={subjectTest5.value}
      />);
    expect(wrapper.find('p').text()).toEqual(quadWithDefinition.object.value);
  });
  it('shows super properties when linked', () => {
    const wrapper = mount(
      <PropertyList
        classIris={[]}
        propertyIris={[objectTest2]}
        store={createStore([quadWithTargetClass, quadWithSuperProperty])}
        linkbuilder={''}
      />);
    expect(wrapper.find({ href: quadWithSuperProperty.object.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows sub properties when found', () => {
    const wrapper = mount(
      <PropertyList
        classIris={[]}
        propertyIris={[objectTest2]}
        store={createStore([quadWithSuperClass, quadWithSubProperty])}
        linkbuilder={''}
      />);
    expect(wrapper.find({ href: quadWithSubProperty.subject.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows used in different class', () => {
    const wrapper = mount(
      <PropertyList
        classIris={[]}
        propertyIris={[objectTest1]}
        store={createStore([quadWithPathToObject2, quadWithPropertyToSubject2, quadWithTargetClassFromObject5])}
        linkbuilder={''}
      />);
    expect(wrapper.find({ href: quadWithTargetClassFromObject5.object.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('hides class when linked no SHACL TargetClass found', () => {
    const wrapper = shallow(
      <PropertyList
        classIris={[]}
        propertyIris={[objectTest1]}
        store={createStore([quadWithPathToObject2, quadWithPropertyToSubject2])}
        linkbuilder={objectTest1.value}
      />);
    expect(wrapper.find({ href: quadWithTargetClassFromObject5.object.value }).getElements().length)
      .toEqual(0);
  });

  it('shows related class from path', () => {
    const wrapper = mount(
      <PropertyList
        classIris={[]}
        propertyIris={[objectTest1]}
        store={createStore([quadWithPathToObject2, quadWithClass])}
        linkbuilder={''}
      />);
    expect(wrapper.find({ href: quadWithClass.object.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('create proper link when using linkbuilder', () => {
    const wrapper = mount(
      <PropertyList
        classIris={[]}
        propertyIris={[objectTest1]}
        store={createStore([quadWithPathToObject2, quadWithClass])}
        linkbuilder={objectTest1.value}
      />);
    expect(wrapper.find({ href: objectTest1.value + quadWithClass.object.value }).getElements().length)
      .toBeGreaterThan(0);
  });
});

function createStore(quads: Quad[]) {
  return new Store(quads);
}
