import { shallow } from 'enzyme';
import { objectTest3, quadWithDefinitionLiteral } from '../TestData';
import React from 'react';
import LabelComponent from '../../components/LabelComponent';
import { Quad } from 'rdf-js';
import Store from '../../lib/Store';

describe('<LabelComponent /> shows SKOS:prefLabel, RDFS:label or local name - in that order of preference', () => {
  it('shows SKOS:prefLabel', () => {
    const wrapper = shallow(
      <LabelComponent
        resourceIri={objectTest3}
        store={createStore([quadWithDefinitionLiteral])}
      />);
    expect(wrapper.html()).toMatch('test3');
  });

  it('shows RDFS:label', () => {
    const wrapper = shallow(
      <LabelComponent
        resourceIri={objectTest3}
        store={createStore([quadWithDefinitionLiteral])}
      />);
    expect(wrapper.html()).toMatch('test3');
  });

  it('shows local name from resourceIri', () => {
    const wrapper = shallow(
      <LabelComponent
        resourceIri={objectTest3}
        store={createStore([quadWithDefinitionLiteral])}
      />);
    expect(wrapper.html()).toMatch('test3');
  });
});

function createStore(quads: Quad[]) {
  return new Store(quads);
}
