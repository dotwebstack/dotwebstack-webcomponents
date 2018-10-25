import { shallow } from 'enzyme';
import React from 'react';
import Resource from '../../components/Resource';
import { subjectTypeRdf, quadWith1, quadWithPredicateObject2 } from '../TestData';
import { Quad } from 'rdf-js';
import Store from '../../lib/Store';

function createStore(quads: Quad[]) {
  return new Store(quads);
}

describe('<Resource />', () => {

  it('shows predicates and objects linked to given resourceIRI', () => {
    const wrapper = shallow(
      <Resource
        resourceIri={subjectTypeRdf}
        store={createStore([quadWith1, quadWithPredicateObject2])}
      />);
    expect(wrapper.find({ href: quadWith1.predicate.value }).getElements().length)
      .toBeGreaterThan(0);
    expect(wrapper.find({ href: quadWith1.object.value }).getElements().length)
      .toBeGreaterThan(0);
    expect(wrapper.find({ href: quadWithPredicateObject2.predicate.value }).getElements().length)
      .toBeGreaterThan(0);
    expect(wrapper.find({ href: quadWithPredicateObject2.object.value }).getElements().length)
      .toBeGreaterThan(0);
  });
});
