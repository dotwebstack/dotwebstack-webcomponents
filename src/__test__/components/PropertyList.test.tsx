import { shallow } from 'enzyme';
import { Quad } from 'rdf-js';
import React from 'react';
import PropertyList from '../../components/PropertyList';
import Store from '../../lib/Store';
import { literal2, objectTest1, objectTest2, objectTest4, quadWithDCSubject,
  quadWithDefinition, quadWithDefintionLiteral, quadWithSubProperty,
  quadWithSuperClass, quadWithSuperProperty, quadWithTargetClass, subjectTest5,
  quadWithPathToObject2, quadWithPropertyToSubject2, quadWithTargetClassFromObject5,
  quadWithClass } from '../TestData';

describe('<PropertyList />', () => {
  it('shows property IRI when nothing else provided', () => {
    const wrapper = shallow(<PropertyList classIris={[]} propertyIris={[objectTest1]}
      store={createStore([])}
      />);
    expect(wrapper.find({ href: objectTest1.value })
    .getElements().length).toBeGreaterThan(0);
  });

  it('shows linked definition when found', () => {
    const wrapper = shallow(<PropertyList classIris={[]} propertyIris={[subjectTest5]}
      store={createStore([quadWithDefintionLiteral])}
      />);
    expect(wrapper.find('p').text()).toEqual(literal2.value);
  });

  it('shows linked subject definition when no linked definition found', () => {
    const wrapper = shallow(<PropertyList classIris={[]} propertyIris={[subjectTest5]}
      store={createStore([quadWithDCSubject, quadWithDefinition])}
      />);
    expect(wrapper.find('p').text()).toEqual(objectTest4.value);
  });
  it('shows super properties when linked', () => {
    const wrapper = shallow(<PropertyList classIris={[]} propertyIris={[objectTest2]}
      store={createStore([quadWithTargetClass, quadWithSuperProperty])}
      />);
    expect(wrapper.find({ href: subjectTest5.value })
    .getElements().length).toBeGreaterThan(0);
  });

  it('shows sub properties when found', () => {
    const wrapper = shallow(<PropertyList classIris={[]} propertyIris={[objectTest2]}
      store={createStore([quadWithSuperClass, quadWithSubProperty])}
      />);
    expect(wrapper.find({ href: subjectTest5.value })
    .getElements().length).toBeGreaterThan(0);
  });

  it('shows used in different class', () => {
    const wrapper = shallow(<PropertyList classIris={[]} propertyIris={[objectTest1]}
      store={createStore([quadWithPathToObject2, quadWithPropertyToSubject2, quadWithTargetClassFromObject5])}
      />);
    expect(wrapper.find({ href: objectTest2.value })
    .getElements().length).toBeGreaterThan(0);
  });

  it('hides class when linked no SHACL TargetClass found', () => {
    const wrapper = shallow(<PropertyList classIris={[]} propertyIris={[objectTest1]}
      store={createStore([quadWithPathToObject2, quadWithPropertyToSubject2])}
      />);
    expect(wrapper.find({ href: objectTest2.value })
    .getElements().length).toEqual(0);
  });

  it('shows related class from path', () => {
    const wrapper = shallow(<PropertyList classIris={[]} propertyIris={[objectTest1]}
      store={createStore([quadWithPathToObject2, quadWithClass])}
      />);
    expect(wrapper.find({ href: objectTest2.value })
    .getElements().length).toBeGreaterThan(0);
  });
});

function createStore(quads: Quad[]) {
  return new Store(quads);
}
