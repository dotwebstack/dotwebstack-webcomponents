import { shallow, mount } from 'enzyme';
import { Quad } from 'rdf-js';
import React from 'react';
import PropertyTree from '../../components/PropertyTree';
import Store from '../../lib/Store';
import { objectTest1, quadTree1, quadTree2, quadTree3, quadTree4, quadTree5, quadTreeLoop5,
    quadTreeLoop6, quadTreeLoop7, quadTreeLoop8, objectTest2 } from '../TestData';
import { localName } from '../../utils';

describe('<PropertyTree />', () => {
  it('shows name when propertyIri and empty store provided', () => {
    const wrapper = shallow(<PropertyTree propertyIris={[objectTest1]}
      store={createStore([])}
      />);
    expect(wrapper.find({ href: '#' + localName(objectTest1) })
    .getElements().length).toBeGreaterThan(0);
  });

  it('shows nested tree, grandchildren collapsed', () => {
    const wrapper = mount(<PropertyTree propertyIris={[objectTest1]}
      store={createStore([quadTree1, quadTree2, quadTree3])}
      />);
    expect(wrapper.find({ href: quadTree2.object.value })
    .getElements().length).toBeGreaterThan(0);
    expect(wrapper.find({ href: quadTree3.object.value })
    .getElements().length).toBeGreaterThan(0);
  });

  it('shows multiple unlinked trees', () => {
    const wrapper = mount(<PropertyTree propertyIris={[objectTest1]}
      store={createStore([quadTree1, quadTree4, quadTree5])}
      />);
    expect(wrapper.find({ href: quadTree5.object.value })
    .getElements().length).toBeGreaterThan(0);
    expect(wrapper.find({ href: quadTree4.object.value })
    .getElements().length).toBeGreaterThan(0);
    expect(wrapper.find({ href: quadTree1.object.value })
    .getElements().length).toBeGreaterThan(0);
  });

  it('shows multiple trees with one nested', () => {
    const wrapper = mount(<PropertyTree propertyIris={[objectTest1]}
      store={createStore([quadTree1, quadTree4, quadTree3])}
      />);
    expect(wrapper.find({ href: quadTree3.object.value })
    .getElements().length).toBeGreaterThan(0);
    expect(wrapper.find({ href: quadTree4.object.value })
    .getElements().length).toBeGreaterThan(0);
    expect(wrapper.find({ href: quadTree1.object.value })
    .getElements().length).toBeGreaterThan(0);
  });

  it('handles multiple property IRIs', () => {
    const wrapper = mount(<PropertyTree propertyIris={[objectTest1, objectTest2]}
      store={createStore([quadTree4, quadTree5])}
      />);
    expect(wrapper.find({ href: quadTree5.object.value })
    .getElements().length).toBeGreaterThan(0);
    expect(wrapper.find({ href: quadTree4.object.value })
    .getElements().length).toBeGreaterThan(0);
  });

  it('shows error on looped tree', () => {
    const wrapper = mount(<PropertyTree propertyIris={[objectTest1]}
      store={createStore([quadTreeLoop5, quadTreeLoop6, quadTreeLoop7, quadTreeLoop8])}
      />);
    expect(wrapper.html()).toMatch('error');
  });
});

function createStore(quads: Quad[]) {
  return new Store(quads);
}
