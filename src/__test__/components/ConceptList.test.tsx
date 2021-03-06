import { shallow } from 'enzyme';
import { Quad } from 'rdf-js';
import Store from '../../lib/Store';
import ConceptList from '../../components/ConceptList';
import {
  quadWith1, quadWithPredicateObject2, quadWithPredicate2,
  quadWithRdfsLabelLiteral, quadWithDefinitionLiteral, quadWithBroaderConcept, quadWithRelatedConcept,
} from '../TestData';
import React from 'react';

describe('<ConceptList />', () => {
  it('shows subject link', () => {
    const wrapper = shallow(
      <ConceptList
        store={createStore([quadWith1, quadWithPredicateObject2, quadWithPredicate2])}
      />);
    expect(wrapper.find('a').text()).toMatch(quadWithPredicate2.subject.value);
  });

  it('shows the link when defined', () => {
    const wrapper = shallow(
      <ConceptList
        store={createStore([quadWithPredicate2, quadWithRdfsLabelLiteral])}
      />);
    expect(wrapper.find('a').text()).toEqual(quadWithRdfsLabelLiteral.subject.value);
  });

  it('shows the linked definition', () => {
    const wrapper = shallow(
      <ConceptList
        store={createStore([quadWithPredicate2, quadWithDefinitionLiteral])}
      />);
    expect(wrapper.find('p').text()).toEqual(quadWithDefinitionLiteral.object.value);
  });

  it('shows a broader concept', () => {
    const wrapper = shallow(
      <ConceptList
        store={createStore([quadWithPredicate2, quadWithBroaderConcept])}
      />);
    expect(wrapper.find({ href: quadWithBroaderConcept.object.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows a related concept', () => {
    const wrapper = shallow(
      <ConceptList
        store={createStore([quadWithPredicate2, quadWithRelatedConcept])}
      />);
    expect(wrapper.find({ href: quadWithRelatedConcept.object.value }) .getElements().length)
      .toBeGreaterThan(0);
  });
});

function createStore(quads: Quad[]) {
  return new Store(quads);
}
