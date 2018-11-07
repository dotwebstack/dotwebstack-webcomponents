import { shallow } from 'enzyme';
import {
  objectTest3, quadWithRdfsLabelLiteral, quadWithSkosLabelLiteral,
} from '../TestData';
import React from 'react';
import { Quad } from 'rdf-js';
import Store from '../../lib/Store';
import Label from '../../components/Label';

describe('<Label /> shows SKOS:prefLabel, RDFS:label or local name - in that order of preference', () => {
  it('shows SKOS:prefLabel', () => {
    const wrapper = shallow(
      <Label
        resourceIri={quadWithSkosLabelLiteral.subject}
        store={createStore([quadWithSkosLabelLiteral])}
      />);
    expect(wrapper.html()).toMatch(quadWithSkosLabelLiteral.object.value);
  });

  it('shows RDFS:label', () => {
    const wrapper = shallow(
      <Label
        resourceIri={quadWithRdfsLabelLiteral.subject}
        store={createStore([quadWithRdfsLabelLiteral])}
      />);
    expect(wrapper.html()).toMatch(quadWithRdfsLabelLiteral.object.value);
  });

  it('shows local name from resourceIri', () => {
    const wrapper = shallow(
      <Label
        resourceIri={objectTest3}
        store={createStore([quadWithRdfsLabelLiteral])}
      />);
    expect(wrapper.html()).toMatch('test3');
  });
});

function createStore(quads: Quad[]) {
  return new Store(quads);
}
