import { shallow, mount } from 'enzyme';
import { Quad } from 'rdf-js';
import React from 'react';
import PropertyTree from '../../components/PropertyTree';
import Store from '../../lib/Store';
import { objectTest1, quadTree1, quadTree2, quadTree3, quadTree4, quadTree5 } from '../TestData';
import { localName } from '../../utils';
//      objectTest2, quadWithDCSubject,
//   quadWithDefinition, quadWithDefintionLiteral, quadWithSubProperty,
//   quadWithSuperClass, quadWithSuperProperty, quadWithTargetClass, subjectTest5,
//   quadWithPathToObject2, quadWithPropertyToSubject2, quadWithTargetClassFromObject5,
//   quadWithClass } from '../TestData';

describe('<PropertyTree />', () => {
  it('shows name when propertyIri and empty store provided', () => {
    const wrapper = shallow(<PropertyTree propertyIris={[objectTest1]}
      store={createStore([])}
      />);
      // tslint:disable-next-line
    console.log(wrapper.html(), localName(objectTest1));
    expect(wrapper.find({ href: '#' + localName(objectTest1) })
    .getElements().length).toBeGreaterThan(0);
  });

  it('shows nested tree', () => {
    const wrapper = mount(<PropertyTree propertyIris={[objectTest1]}
      store={createStore([quadTree1, quadTree2, quadTree3])}
      />);
      // tslint:disable-next-line
    console.log(wrapper.html(), quadTree1.object.value );
    expect(wrapper.find({ href: quadTree2.object.value })
    .getElements().length).toBeGreaterThan(0);
    expect(wrapper.find({ href: quadTree3.object.value })
    .getElements().length).toBeGreaterThan(0);
    expect(wrapper.find({ href: quadTree1.object.value })
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
});

function createStore(quads: Quad[]) {
  return new Store(quads);
}
