import { shallow } from 'enzyme';
import { Quad } from 'rdf-js';
import Store from '../../lib/Store';
import ConceptList from '../../components/ConceptList';
import { quadWith1, quadWithPredicateObject2, quadWithPredicate2, subjectTest5,
  quadWithLabelLiteral, literal1, quadWithDefintionLiteral,
  literal2, quadWithBroaderConcept, quadWithRelatedConcept, objectTest2, objectTest1 } from '../TestData';
import React from 'react';

describe('<ConceptList />', () => {
  it('shows subject link', () => {
    const wrapper = shallow(<ConceptList
      store={createStore([quadWith1, quadWithPredicateObject2, quadWithPredicate2])}
      />);
    expect(wrapper.find('a').text()).toMatch(subjectTest5.value);
  });

  it('shows the label when defined', () => {
    const wrapper = shallow(<ConceptList
      store={createStore([quadWithPredicate2, quadWithLabelLiteral])}
      />);
    expect(wrapper.find('h3').text()).toEqual(literal1.value);
  });

  it('shows the linked definition', () => {
    const wrapper = shallow(<ConceptList
      store={createStore([quadWithPredicate2, quadWithDefintionLiteral])}
      />);
    expect(wrapper.find('p').text()).toEqual(literal2.value);
  });

  it('shows a broader concept', () => {
    const wrapper = shallow(<ConceptList
      store={createStore([quadWithPredicate2, quadWithBroaderConcept])}
      />);
    expect(wrapper.find({ href: objectTest1.value })
    .getElements().length).toBeGreaterThan(0);
  });

  it('shows a related concept', () => {
    const wrapper = shallow(<ConceptList
      store={createStore([quadWithPredicate2, quadWithRelatedConcept])}
      />);
    expect(wrapper.find({ href: objectTest2.value })
    .getElements().length).toBeGreaterThan(0);
  });
});

function createStore(quads: Quad[]) {
  return new Store(quads);
}
