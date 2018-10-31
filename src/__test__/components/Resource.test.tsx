import { shallow } from 'enzyme';
import React from 'react';
import Resource from '../../components/Resource';
import { subjectTypeRdf, quadWith1, quadWithPredicateObject2 } from '../TestData';
import { Quad } from 'rdf-js';
import Store from '../../lib/Store';
import { namedNode } from '@rdfjs/data-model';

function createStore(quads: Quad[]) {
  return new Store(quads);
}

const rows = [
  {
    predicate: namedNode('http://www.w3.org/2000/01/rdf-schema#isDefinedBy'),
    label: 'Is defined by',
  },
  {
    predicate: namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
    label: 'Label',
  },
  {
    predicate: namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
    label: 'Type',
  },
  {
    predicate: namedNode('http://purl.org/dc/terms/subject'),
    label: 'Subject',
  },
  {
    predicate: namedNode('http://purl.org/dc/terms/extralabel'),
    label: 'Extra label',
  },
];

describe('<Resource />', () => {

  it('shows predicates and objects linked to given resourceIRI', () => {
    const wrapper = shallow(
      <Resource
        resourceIri={subjectTypeRdf}
        store={createStore([quadWith1, quadWithPredicateObject2])}
        rows={rows}
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
