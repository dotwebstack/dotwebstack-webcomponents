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
  quadWithDomain2,
  quadWithRange,
  quadWithRange2,
} from '../TestData';

describe('<PropertyList />', () => {
  it('shows property IRI when nothing else provided', () => {
    const wrapper = shallow(
      <PropertyList
        classIris={[]}
        propertyIris={[objectTest1]}
        store={createStore([])}
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
      />);
    expect(wrapper.find('p').text()).toEqual(quadWithDefinitionLiteral.object.value);
  });

  it('shows linked subject definition when no linked definition found', () => {
    const wrapper = shallow(
      <PropertyList
        classIris={[]}
        propertyIris={[subjectTest5]}
        store={createStore([quadWithDCSubject, quadWithDefinition])}
      />);
    expect(wrapper.find('p').text()).toEqual(quadWithDefinition.object.value);
  });
  it('shows super properties when linked', () => {
    const wrapper = mount(
      <PropertyList
        classIris={[]}
        propertyIris={[objectTest2]}
        store={createStore([quadWithTargetClass, quadWithSuperProperty])}
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
      />);
    expect(wrapper.find({ href: quadWithSubProperty.subject.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows property being used on class (SHACL)', () => {
    const wrapper = mount(
      <PropertyList
        classIris={[]}
        propertyIris={[objectTest1]}
        store={createStore([quadWithPathToObject2, quadWithPropertyToSubject2, quadWithTargetClassFromObject5])}
      />);
    expect(wrapper.find({ href: quadWithTargetClassFromObject5.object.value }).getElements().length)
      .toEqual(1);
  });

  it('shows property being a property of class', () => {
    const wrapper = mount(
      <PropertyList
        classIris={[]}
        propertyIris={[objectTest1]}
        store={createStore([quadWithDomain2])}
      />);
    expect(wrapper.find({ href: quadWithDomain2.object.value }).getElements().length)
      .toEqual(1);
  });

  it('shows property being a property of one class, when both SHACL and rdfs:domain are stated', () => {
    const wrapper = mount(
      <PropertyList
        classIris={[]}
        propertyIris={[objectTest1]}
        store={createStore([quadWithPathToObject2, quadWithPropertyToSubject2, quadWithTargetClassFromObject5,
          quadWithDomain2])}
      />);
    expect(wrapper.find({ href: quadWithTargetClassFromObject5.object.value }).getElements().length)
      .toEqual(1);
  });

  it('hides class when linked no SHACL TargetClass found', () => {
    const wrapper = shallow(
      <PropertyList
        classIris={[]}
        propertyIris={[objectTest1]}
        store={createStore([quadWithPathToObject2, quadWithPropertyToSubject2])}
      />);
    expect(wrapper.find({ href: quadWithTargetClassFromObject5.object.value }).getElements().length)
      .toEqual(0);
  });

  it('shows related class from property shape (SHACL)', () => {
    const wrapper = mount(
      <PropertyList
        classIris={[]}
        propertyIris={[objectTest1]}
        store={createStore([quadWithPathToObject2, quadWithClass])}
      />);
    expect(wrapper.find({ href: quadWithClass.object.value }).getElements().length)
      .toEqual(1);
  });

  it('shows related class from rdfs:range', () => {
    const wrapper = mount(
      <PropertyList
        classIris={[]}
        propertyIris={[objectTest1]}
        store={createStore([quadWithRange])}
      />);
    expect(wrapper.find({ href: quadWithRange.object.value }).getElements().length)
      .toEqual(1);
  });

  it('shows related class from property shape (SHACL) and rdfs:domain if same', () => {
    const wrapper = mount(
      <PropertyList
        classIris={[]}
        propertyIris={[objectTest1]}
        store={createStore([quadWithPathToObject2, quadWithClass, quadWithRange])}
      />);
    expect(wrapper.find({ href: objectTest2.value }).getElements().length)
      .toEqual(1);
  });

  it('shows related class from property shape (SHACL), not rdfs:domain if different', () => {
    const wrapper = mount(
      <PropertyList
        classIris={[]}
        propertyIris={[objectTest1]}
        store={createStore([quadWithPathToObject2, quadWithClass, quadWithRange2])}
      />);
    expect(wrapper.find({ href: objectTest2.value }).getElements().length)
      .toEqual(1);
  });
});

function createStore(quads: Quad[]) {
  return new Store(quads);
}
