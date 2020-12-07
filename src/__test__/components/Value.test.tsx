import React from 'react';
import { shallow } from 'enzyme';
import Value from '../../components/Value';
import { objectTest1, literal1 } from '../TestData';
import { localName } from '../../utils';
import { Term, Literal, NamedNode } from 'rdf-js';
import { literal, namedNode } from '@rdfjs/data-model';
import { XSD, SKOS } from '../../namespaces';

describe('<Value />', () => {
  it('constructs value with default settings', () => {
    const wrapper = shallow(
      <Value
        term={objectTest1}
      />);
    expect(wrapper.html()).toEqual(
      `<a href="${objectTest1.value}">${objectTest1.value}</a>`);
  });

  it('constructs value with local link title', () => {
    const wrapper = shallow(
      <Value
        term={objectTest1}
        local={true}
      />);
    expect(wrapper.html()).toEqual(
      `<a href="${objectTest1.value}">${localName(objectTest1)}</a>`);
  });

  it('constructs value with custom linkBuilder', () => {
    const wrapper = shallow(
      <Value
        term={objectTest1}
        linkBuilder={(term: Term) => term.value.concat('/foo')}
      />);
    expect(wrapper.html()).toEqual(
      `<a href="${objectTest1.value.concat('/foo')}">${objectTest1.value}</a>`);
  });

  it('constructs value from literal', () => {
    const wrapper = shallow(
      <Value
        term={literal1}
      />);
    expect(wrapper.html()).toEqual(`<span>${literal1.value}</span>`);
  });

  it('renders a LiteralValue', () => {
    const term = literal('test1');
    const wrapper = shallow(
      <Value
        term={term}
        disableLegacyFormatting
      />);
    const literalValue = wrapper.find('LiteralValue');
    expect(literalValue).toHaveLength(1);
    expect(literalValue.prop('literal')).toEqual(term);
  });

  it('renders a xsd:string with default formatter', () => {
    const term = literal('test2');
    const wrapper = shallow(
      <Value
        term={term}
        disableLegacyFormatting
      />);
    expect(wrapper.html()).toEqual('<span>test2</span>');
  });

  it('renders a xsd:string with custom formatter', () => {
    const term = literal('test2');
    const formatString = (literal: Literal) => literal.value.toLocaleUpperCase();
    const wrapper = shallow(
      <Value
        term={term}
        disableLegacyFormatting
        formatString={formatString}
      />);
    expect(wrapper.html()).toEqual('<span>TEST2</span>');
  });

  it('renders a rdf:langString with default formatter', () => {
    const term = literal('test3', 'en');
    const wrapper = shallow(
      <Value
        term={term}
        disableLegacyFormatting
      />);
    expect(wrapper.html()).toEqual('<span>test3 (en)</span>');
  });

  it('renders a rdf:langString with custom formatter', () => {
    const term = literal('test3', 'en');
    const formatLangString = (literal: Literal) => `${literal.language}: ${literal.value}`;
    const wrapper = shallow(
      <Value
        term={term}
        disableLegacyFormatting
        formatLangString={formatLangString}
      />);
    expect(wrapper.html()).toEqual('<span>en: test3</span>');
  });

  it('renders a xsd:boolean string with default formatter', () => {
    const term = literal('test4', namedNode(XSD + 'boolean'));
    const wrapper = shallow(
      <Value
        term={term}
        disableLegacyFormatting
      />);
    expect(wrapper.html()).toEqual('<span>test4 (xsd:boolean)</span>');
  });

  it('renders a xsd:boolean string with custom formatter', () => {
    const term = literal('test4', namedNode(XSD + 'boolean'));
    const formatOtherLiteral = (literal: Literal, shorten: (resource: string) => string) =>
      `${literal.value}^${shorten(literal.datatype.value)}`;
    const wrapper = shallow(
      <Value
        term={term}
        disableLegacyFormatting
        formatOtherLiteral={formatOtherLiteral}
      />);
    expect(wrapper.html()).toEqual('<span>test4^xsd:boolean</span>');
  });

  it('renders a ex:someType string with prefix applied to datatype', () => {
    const term = literal('test4', namedNode('http://example.org/someType'));
    const prefixes = { ex: 'http://example.org/' };
    const wrapper = shallow(
      <Value
        term={term}
        disableLegacyFormatting
        prefixes={prefixes}
      />);
    expect(wrapper.html()).toEqual('<span>test4 (ex:someType)</span>');
  });

  it('renders a named node with default formatter in full', () => {
    const term = namedNode('http://example.org/xyz');
    const wrapper = shallow(
      <Value
        term={term}
        disableLegacyFormatting
      />);
    expect(wrapper.html()).toEqual('<a href="http://example.org/xyz">http://example.org/xyz</a>');
  });

  it('renders a named node with default formatter shortened with custom prefix', () => {
    const term = namedNode('http://example.org/xyz');
    const prefixes = { ex: 'http://example.org/' };
    const wrapper = shallow(
      <Value
        term={term}
        disableLegacyFormatting
        prefixes={prefixes}
      />);
    expect(wrapper.html()).toEqual('<a href="http://example.org/xyz">ex:xyz</a>');
  });

  it('renders a named node with default formatter shortened with default prefix', () => {
    const term = namedNode(`${SKOS}Concept`);
    const wrapper = shallow(
      <Value
        term={term}
        disableLegacyFormatting
      />);
    expect(wrapper.html()).toEqual('<a href="http://www.w3.org/2004/02/skos/core#Concept">skos:Concept</a>');
  });

  it('applies link builder for named node href', () => {
    const term = namedNode('http://example.org/xyz');
    const linkBuilder = (term: Term) => `${term.value}/abc`;
    const wrapper = shallow(
      <Value
        term={term}
        disableLegacyFormatting
        linkBuilder={linkBuilder}
      />);
    expect(wrapper.html()).toEqual('<a href="http://example.org/xyz/abc">http://example.org/xyz</a>');
  });

  it('renders a named node with a LiteralValue as anchor text', () => {
    const term = namedNode('http://example.org/xyz');
    const wrapper = shallow(
      <Value
        term={term}
        disableLegacyFormatting
      />);
    const literalValue = wrapper.find('a').find('LiteralValue');
    expect(literalValue).toHaveLength(1);
    expect(literalValue.prop('literal')).toEqual(literal('http://example.org/xyz'));
  });

  it('renders a named node with multiple labels from custom label function', () => {
    const term = namedNode('http://example.org/xyz');
    // const getNamedNodeLabels = (namedNode: NamedNode, shorten: (resource: string) => string) => [
    const getNamedNodeLabels = (namedNode: NamedNode) => [
      literal(namedNode.value),
      literal('Xyz', 'nl'),
      literal('Xyz', 'en'),
    ];
    const wrapper = shallow(
      <Value
        term={term}
        disableLegacyFormatting
        getNamedNodeLabels={getNamedNodeLabels}
      />);
    expect(wrapper.html()).toEqual(
      '<a href="http://example.org/xyz">http://example.org/xyz</a><br/>' +
      '<a href="http://example.org/xyz">Xyz (nl)</a><br/>' +
      '<a href="http://example.org/xyz">Xyz (en)</a>');
  });

  it('renders a named node with custom label function and applies custom prefix', () => {
    const term = namedNode('http://example.org/xyz');
    const getNamedNodeLabels = (namedNode: NamedNode, shorten: (resource: string) => string) => [
      literal(shorten(namedNode.value), 'de'),
    ];
    const prefixes = { ex: 'http://example.org/' };
    const wrapper = shallow(
      <Value
        term={term}
        disableLegacyFormatting
        getNamedNodeLabels={getNamedNodeLabels}
        prefixes={prefixes}
      />);
    expect(wrapper.html()).toEqual('<a href="http://example.org/xyz">ex:xyz (de)</a>');
  });

  it('renders a named node with custom label function and applies default prefix', () => {
    const term = namedNode(`${SKOS}ConceptScheme`);
    const getNamedNodeLabels = (namedNode: NamedNode, shorten: (resource: string) => string) => [
      literal(shorten(namedNode.value), 'cz'),
    ];
    const wrapper = shallow(
      <Value
        term={term}
        disableLegacyFormatting
        getNamedNodeLabels={getNamedNodeLabels}
      />);
    expect(wrapper.html()).toEqual(
      '<a href="http://www.w3.org/2004/02/skos/core#ConceptScheme">skos:ConceptScheme (cz)</a>');
  });

  it('falls back to default label rendering when custom label function returns no labels', () => {
    const term = namedNode(`${SKOS}Collection`);
    const getNamedNodeLabels = () => [];
    const wrapper = shallow(
      <Value
        term={term}
        disableLegacyFormatting
        getNamedNodeLabels={getNamedNodeLabels}
      />);
    expect(wrapper.html()).toEqual(
      '<a href="http://www.w3.org/2004/02/skos/core#Collection">skos:Collection</a>');
  });

});
