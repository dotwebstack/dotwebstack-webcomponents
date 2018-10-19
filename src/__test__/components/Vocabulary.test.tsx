import { mount } from 'enzyme';
import { Quad } from 'rdf-js';
import Store from '../../lib/Store';
import Vocabulary from '../../components/Vocabulary';
import { subjectTest5, quadWithIsDefinedBy, quadWithTypeClassOwl, quadWithTypeClassRdfs, quadWithTypeToPropertyRdf,
  quadWithTypeToDatatypeProperty, quadWithTypeToObjectProperty } from '../TestData';
import React from 'react';

describe('<Vocabulary />', () => {

  jest.mock('../../components/ListIndex', () => 'mock-listindex');
  jest.mock('../../components/ClassList', () => 'ClassList');
  jest.mock('../../components/PropertyList', () => 'mock-propertylist');

  it('extracts IRIs defined by provided ontology with OWL class', () => {
    const wrapper = mount(<Vocabulary
      store={createStore([quadWithIsDefinedBy, quadWithTypeClassOwl])}
      ontology={subjectTest5}
      />);
    expect(wrapper.find('ClassList').prop('classIris')).toEqual([quadWithIsDefinedBy.subject]);
  });

  it('extracts IRIs defined by provided ontology with RDFS class', () => {
    const wrapper = mount(<Vocabulary
      store={createStore([quadWithIsDefinedBy, quadWithTypeClassRdfs])}
      ontology={subjectTest5}
      />);
    expect(wrapper.find('ClassList').prop('classIris')).toEqual([quadWithIsDefinedBy.subject]);
  });

  it('extracts IRIs defined by provided ontology with RDF property', () => {
    const wrapper = mount(<Vocabulary
      store={createStore([quadWithIsDefinedBy, quadWithTypeToPropertyRdf])}
      ontology={subjectTest5}
      />);
    expect(wrapper.find('ClassList').prop('propertyIris')).toEqual([quadWithIsDefinedBy.subject]);
  });

  it('extracts IRIs defined by provided ontology with OWL DatatypeProperty', () => {
    const wrapper = mount(<Vocabulary
      store={createStore([quadWithIsDefinedBy, quadWithTypeToDatatypeProperty])}
      ontology={subjectTest5}
      />);
    expect(wrapper.find('ClassList').prop('propertyIris')).toEqual([quadWithIsDefinedBy.subject]);
  });

  it('extracts IRIs defined by provided ontology with OWL ObjectProperty', () => {
    const wrapper = mount(<Vocabulary
      store={createStore([quadWithIsDefinedBy, quadWithTypeToObjectProperty])}
      ontology={subjectTest5}
      />);
    expect(wrapper.find('ClassList').prop('propertyIris')).toEqual([quadWithIsDefinedBy.subject]);
  });
});

function createStore(quads: Quad[]) {
  return new Store(quads);
}
