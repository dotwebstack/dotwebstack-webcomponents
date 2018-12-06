import { mount, shallow } from 'enzyme';
import { Quad } from 'rdf-js';
import React from 'react';
import ClassList from '../../components/ClassList';
import Store from '../../lib/Store';
import {
  literal1,
  objectTest1, objectTest2, objectTest4, quadWithDCSubject, quadWithDefinition,
  quadWithDefinitionLiteral, quadWithRdfsLabelLiteral, quadWithPath, quadWithPathToObject2,
  quadWithPredicate2, quadWithProperty, quadWithReversedProperty, quadWithReversedTargetClass,
  quadWithSubClass, quadWithSuperClass, quadWithTargetClass, subjectTest5,
} from '../TestData';
import { linkBuilder, localName } from '../../utils';
import Value from '../../components/Value';

const linkbuilder = 'kadaster.nl';

describe('<ClassList />', () => {
  it('shows class IRI when nothing else provided', () => {
    const wrapper = shallow(
      <ClassList
        classIris={[objectTest1]}
        propertyIris={[]}
        store={createStore([])}
        linkbuilder={''}
      />);
    expect(wrapper.find({ href: objectTest1.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows linked definition when found', () => {
    const wrapper = shallow(
      <ClassList
        classIris={[subjectTest5]}
        propertyIris={[]}
        store={createStore([quadWithDefinitionLiteral])}
        linkbuilder={''}
      />);
    expect(wrapper.find('p').text()).toEqual(quadWithDefinitionLiteral.object.value);
  });

  it('shows linked subject definition when no linked definition found', () => {
    const wrapper = shallow(
      <ClassList
        classIris={[subjectTest5]}
        propertyIris={[]}
        store={createStore([quadWithDCSubject, quadWithDefinition])}
        linkbuilder={''}
      />);
    expect(wrapper.find('p').text()).toEqual(quadWithDefinition.object.value);
  });

  it('shows superclass when found', () => {
    const wrapper = mount(
      <ClassList
        classIris={[objectTest4]}
        propertyIris={[objectTest2]}
        store={createStore([quadWithPredicate2, quadWithRdfsLabelLiteral, quadWithSuperClass])}
        linkbuilder={''}
      />);
    expect(wrapper.find({ href: quadWithSuperClass.subject.value }).getElements().length)
      .toBeGreaterThan(0);
    expect(wrapper.find({ href: quadWithRdfsLabelLiteral.subject.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows subclass when found', () => {
    const wrapper = mount(
      <ClassList
        classIris={[objectTest4]}
        propertyIris={[objectTest2]}
        store={createStore([quadWithPredicate2, quadWithRdfsLabelLiteral, quadWithSubClass])}
        linkbuilder={''}
      />);
    expect(wrapper.find({ href: objectTest4.value }).getElements().length)
      .toBeGreaterThan(0);
    expect(wrapper.find({ href: subjectTest5.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows properties when properly linked', () => {
    const wrapper = mount(
      <ClassList
        classIris={[objectTest4]}
        propertyIris={[objectTest2]}
        store={createStore([quadWithTargetClass, quadWithProperty, quadWithPath])}
        linkbuilder={''}
      />);
    expect(wrapper.find({ href: quadWithPath.object.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows inherited properties when found', () => {
    const wrapper = mount(
      <ClassList
        classIris={[objectTest4]}
        propertyIris={[]}
        store={createStore([quadWithSuperClass, quadWithReversedTargetClass,
          quadWithReversedProperty, quadWithPathToObject2])}
        linkbuilder={''}
      />);
    // tslint:disable-next-line:no-console
    console.log(localName(quadWithPathToObject2.object));
    expect(wrapper.find({ href: '#'+localName(quadWithPathToObject2.object) }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('constructs local link', () => {
    const wrapper = shallow(
      <Value
        term={objectTest1}
        linkBuilder={''}
        local={true}
      />);
    expect(wrapper.html()).toMatch('#test1');
    expect(wrapper.find({ href: '#test1' }).getElements().length).toBeGreaterThan(0);
    expect(wrapper.text()).toEqual('test1');
  });

  it('constructs remote link', () => {
    const wrapper = shallow(
      <Value
        term={objectTest1}
        linkBuilder={linkBuilder(objectTest1.value, linkbuilder)}
        local={true}
      />);
    // tslint:disable-next-line:no-console
    console.log(wrapper.html());
    expect(wrapper.html()).toMatch('http://example.org/test1');
    expect(wrapper.find({ href: linkbuilder + 'http://example.org/test1' })
      .getElements().length).toBeGreaterThan(0);
    expect(wrapper.text()).toEqual('test1');
  });

  it('constructs Value with Literal', () => {
    const wrapper = shallow(
      <Value
        term={literal1}
        linkBuilder={linkBuilder(literal1.value, linkbuilder)}
      />);
    expect(wrapper.html()).toMatch('<a href=\"kadaster.nltest1\">test1</a>');
    expect(wrapper.text()).toEqual(literal1.value);
  });
});

function createStore(quads: Quad[]) {
  return new Store(quads);
}
