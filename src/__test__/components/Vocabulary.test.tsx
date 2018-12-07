import { mount } from 'enzyme';
import { Quad } from 'rdf-js';
import Store from '../../lib/Store';
import Vocabulary from '../../components/Vocabulary';
import { quadWithIsDefinedBy, quadWithTypeClassOwl, quadWithTypeClassRdfs, quadWithTypeToPropertyRdf,
  quadWithTypeToDatatypeProperty, quadWithTypeToObjectProperty } from '../TestData';
import React from 'react';

describe('<Vocabulary />', () => {

  jest.mock('../../components/ListIndex', () => 'mock-listindex');
  jest.mock('../../components/ClassList', () => 'ClassList');
  jest.mock('../../components/PropertyList', () => 'mock-propertylist');

  it('extracts IRIs defined by provided ontology with OWL class', () => {
    const wrapper = mount(
      <Vocabulary store={createStore([quadWithIsDefinedBy, quadWithTypeClassOwl])}, 
         linkbuilder={''} />);
    expect(wrapper.find('ClassList').prop('classIris')).toEqual([quadWithIsDefinedBy.subject]);
  });

  it('extracts IRIs defined by provided ontology with RDFS class', () => {
    const wrapper = mount(
      <Vocabulary store={createStore([quadWithIsDefinedBy, quadWithTypeClassRdfs])}
        linkbuilder={''}
      />);
    expect(wrapper.find('ClassList').prop('classIris')).toEqual([quadWithIsDefinedBy.subject]);
  });

  it('extracts IRIs defined by provided ontology with RDF property', () => {
    const wrapper = mount(
      <Vocabulary store={createStore([quadWithIsDefinedBy, quadWithTypeToPropertyRdf])} 
          linkbuilder={''}
      />);
    expect(wrapper.find('ClassList').prop('propertyIris')).toEqual([quadWithIsDefinedBy.subject]);
  });

  it('extracts IRIs defined by provided ontology with OWL DatatypeProperty', () => {
    const wrapper = mount(
      <Vocabulary store={createStore([quadWithIsDefinedBy, quadWithTypeToDatatypeProperty])}
        linkbuilder={''}
      />);
    expect(wrapper.find('ClassList').prop('propertyIris')).toEqual([quadWithIsDefinedBy.subject]);
  });

  it('extracts IRIs defined by provided ontology with OWL ObjectProperty', () => {
    const wrapper = mount(
      <Vocabulary store={createStore([quadWithIsDefinedBy, quadWithTypeToObjectProperty])} 
        linkbuilder={''}
      />);
    expect(wrapper.find('ClassList').prop('propertyIris')).toEqual([quadWithIsDefinedBy.subject]);
  });
});

const createStore = (quads: Quad[]) => new Store(quads);
