import { shallow, mount } from 'enzyme';
import { Quad } from 'rdf-js';
import React from 'react';
import ClassTree from '../../components/ClassTree';
import Store from '../../lib/Store';
import {
  objectTest1, quadTree6, quadTree7, quadTree8, quadTree9, quadTree10, quadTreeLoop1,
  quadTreeLoop2, quadTreeLoop3, quadTreeLoop4, objectTest2,
} from '../TestData';
import { localName } from '../../utils';

describe('<ClassTree />', () => {
  it('shows name when propertyIri and empty store provided', () => {
    const wrapper = shallow(
      <ClassTree
        classIris={[objectTest1]}
        store={createStore([])}
      />,
    );
    expect(wrapper.find({ href: '#' + localName(objectTest1) }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows nested tree, grandchildren collapsed', () => {
    const wrapper = mount(
      <ClassTree
        classIris={[objectTest1]}
        store={createStore([quadTree6, quadTree7, quadTree8])}
      />,
    );
    expect(wrapper.find({ href: quadTree7.object.value }).getElements().length)
      .toBeGreaterThan(0);
    expect(wrapper.find({ href: quadTree8.object.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows multiple trees', () => {
    const wrapper = mount(
      <ClassTree
        classIris={[objectTest1]}
        store={createStore([quadTree6, quadTree9, quadTree10])}
      />,
    );
    expect(wrapper.find({ href: quadTree10.object.value }).getElements().length)
      .toBeGreaterThan(0);
    expect(wrapper.find({ href: quadTree9.object.value }).getElements().length)
      .toBeGreaterThan(0);
    expect(wrapper.find({ href: quadTree6.object.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows multiple trees with one nested', () => {
    const wrapper = mount(
      <ClassTree
        classIris={[objectTest1]}
        store={createStore([quadTree6, quadTree9, quadTree8])}
      />,
    );
    expect(wrapper.find({ href: quadTree8.object.value }).getElements().length)
      .toBeGreaterThan(0);
    expect(wrapper.find({ href: quadTree9.object.value }).getElements().length)
      .toBeGreaterThan(0);
    expect(wrapper.find({ href: quadTree6.object.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('handles multiple class IRI trees', () => {
    const wrapper = mount(
      <ClassTree
        classIris={[objectTest1, objectTest2]}
        store={createStore([quadTree7, quadTree10])}
      />,
    );
    expect(wrapper.find({ href: quadTree7.object.value }).getElements().length)
      .toBeGreaterThan(0);
    expect(wrapper.find({ href: quadTree10.object.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows error on looped tree', () => {
    const wrapper = mount(
      <ClassTree
        classIris={[objectTest1]}
        store={createStore([quadTreeLoop1, quadTreeLoop2, quadTreeLoop3, quadTreeLoop4])}
      />,
    );
    expect(wrapper.html()).toMatch('Something went wrong');
  });
});

function createStore(quads: Quad[]) {
  return new Store(quads);
}
