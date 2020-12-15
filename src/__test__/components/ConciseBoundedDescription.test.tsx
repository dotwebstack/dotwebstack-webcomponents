import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import ConciseBoundedDescription from '../../components/ConciseBoundedDescription';
import { NamedNode, BlankNode } from 'rdf-js';
import Store from '../../lib/Store';
import { namedNode } from '@rdfjs/data-model';
import { loadFromObject } from '../../lib/QuadLoader';
import { rdfs, dct, prov, xsd, foaf } from '../../vocab';

const EX = 'http://example.org/';
const ex = {
  something: namedNode(`${EX}something`),
  other: namedNode(`${EX}other`),
  another: namedNode(`${EX}another`),
  color: namedNode(`${EX}color`),
  someTopic: namedNode(`${EX}someTopic`),
  someDocument: namedNode(`${EX}someDocument`),
};

const storeFromJsonLd = async (data: any) => {
  return new Store(await loadFromObject(data));
};

describe('<ConciseBoundedDescription />', () => {

  const prefixes = {
    ex: EX,
  };

  const rows = [{
    predicate: dct.created,
  }, {
    predicate: dct.identifier,
  }];

  const entities: any = [{
    '@id': ex.something.value,
    '@type': prov.Entity.value,
    [dct.description.value]: 'The second best entity',
    [dct.title.value]: '2nd Best',
    [dct.identifier.value]: {
      '@value': '10082.82',
      '@type': xsd.decimal.value,
    },
    [dct.created.value]: {
      '@value': '2020-12-01',
      '@type': xsd.date.value,
    },
    [ex.color.value]: 'yellow',
  }, {
    '@id': ex.other.value,
    '@type': prov.Entity.value,
    [dct.isReplacedBy.value]: { '@id': ex.something.value },
    [rdfs.label.value]: [
      'Other thing',
      {
        '@value': 'Ander ding',
        '@language': 'nl',
      },
    ],
  }, {
    '@id': ex.another.value,
    '@type': prov.Entity.value,
    [dct.hasVersion.value]: { '@id': ex.something.value },
    [rdfs.label.value]: 'Another thing',
  }];

  const primaryTopicAndInformationResource: any = [{
    '@id': ex.someTopic.value,
    [dct.title.value]: 'Some Topic',
    [dct.identifier.value]: 'TOPIC-001',
    [foaf.isPrimaryTopicOf.value]: { '@id': ex.someDocument.value },
  }, {
    '@id': ex.someDocument.value,
    [dct.title.value]: 'Some Document',
    [dct.identifier.value]: [ 'DOC-ABC', 'doc-Abc' ],
    [dct.created.value]: {
      '@value': '2020-11-01',
      '@type': xsd.date.value,
    },
  }];

  const hasResourceIri = (iri: NamedNode) =>
    (item: ShallowWrapper) => (item.prop('resourceIri') as NamedNode).equals(iri);

  it('renders components as expected', async () => {

    const store = await storeFromJsonLd(entities);

    // (just to test passing of resourceProps)
    const resourceProps = {
      valueProps: {
        local: false,
      },
    };

    const wrapper = shallow(
      <ConciseBoundedDescription
        store={store}
        prefixes={prefixes}
        resourceProps={resourceProps}
      />);

    const resources = wrapper.find('Resource');
    expect(resources).toHaveLength(3);

    const sharedProps = {
      store,
      showAllProperties: true,
      disableAutoLabel: true,
      disableLegacyFormatting: true,
      hideEmptyProperties: true,
      renderHeading: true,
      prefixes,
      ...resourceProps,
    };

    expect(resources.filterWhere(hasResourceIri(ex.something)).props()).toEqual({
      resourceIri: ex.something, ...sharedProps,
    });
    expect(resources.filterWhere(hasResourceIri(ex.other)).props()).toEqual({
      resourceIri: ex.other, ...sharedProps,
    });
    expect(resources.filterWhere(hasResourceIri(ex.another)).props()).toEqual({
      resourceIri: ex.another, ...sharedProps,
    });
  });

  it('can find primary topic and information resource with default mechanism', async () => {

    const store = await storeFromJsonLd(entities.concat(primaryTopicAndInformationResource));

    const wrapper = shallow(
      <ConciseBoundedDescription
        store={store}
        prefixes={prefixes}
      />);

      const resources = wrapper.find('Resource');
      expect(resources).toHaveLength(4);

      expect(resources.filterWhere(hasResourceIri(ex.someTopic)).props()).toEqual(expect.objectContaining({
        resourceIri: ex.someTopic,
        resourceType: 'Primary topic',
      }));

      expect(wrapper.find('InformationResource').prop('resource')).toEqual(ex.someDocument);

  });

  it('can find primary topic and information resource with custom mechanism', async () => {

    const store = await storeFromJsonLd(entities.concat(primaryTopicAndInformationResource));

    const getPrimaryTopic = () => ex.something;
    const getInformationResource = (store: Store, primaryTopic: NamedNode | BlankNode | null) => {
      if (store && ex.something.equals(primaryTopic)) {
        return ex.other;
      }
      return null;
    };

    const wrapper = shallow(
      <ConciseBoundedDescription
        store={store}
        prefixes={prefixes}
        determinePrimaryTopic={getPrimaryTopic}
        determineInformationResource={getInformationResource}
      />);

      const resources = wrapper.find('Resource');
      expect(resources).toHaveLength(4);

      expect(resources.filterWhere(hasResourceIri(ex.something)).props()).toEqual(expect.objectContaining({
        resourceIri: ex.something,
        resourceType: 'Primary topic',
      }));

      expect(wrapper.find('InformationResource').prop('resource')).toEqual(ex.other);

  });

  it('uses directly set primary topic and information resource', async () => {

    const store = await storeFromJsonLd(entities.concat(primaryTopicAndInformationResource));

    const wrapper = shallow(
      <ConciseBoundedDescription
        store={store}
        prefixes={prefixes}
        primaryTopic={ex.something}
        informationResource={ex.other}
      />);

      const resources = wrapper.find('Resource');
      expect(resources).toHaveLength(4);

      expect(resources.filterWhere(hasResourceIri(ex.something)).props()).toEqual(expect.objectContaining({
        resourceIri: ex.something,
        resourceType: 'Primary topic',
      }));

      expect(wrapper.find('InformationResource').prop('resource')).toEqual(ex.other);

  });

  it('renders information resource correctly', async () => {

    const store = await storeFromJsonLd(entities.concat(primaryTopicAndInformationResource));

    const wrapper = shallow(
      <ConciseBoundedDescription
        store={store}
        prefixes={prefixes}
        informationResourceCollapsedRows={rows}
      />);

      const informationResource = wrapper.find('InformationResource');
      expect(informationResource.prop('resource')).toEqual(ex.someDocument);

      const container = informationResource.shallow();
      expect(container.exists('div.information-resource-container')).toBe(true);
      expect(container.exists('div.resource-container.border.information-resource-collapsed')).toBe(true);
      expect(container.exists('a.expand-collapse-information-resource[title="Expand"]')).toBe(true);
      expect(container.exists('span.resource-type')).toBe(true);
      expect(container.find('span.resource-type').text()).toBe('«Metadata»');

      const inlineResource = container.find('InlineResource');
      expect(inlineResource.props()).toEqual(expect.objectContaining({
        resource: ex.someDocument,
        propertyRows: rows,
        store,
        prefixes,
      }));

  });

  it('renders information resource correctly (expanded)', async () => {

    const store = await storeFromJsonLd(entities.concat(primaryTopicAndInformationResource));

    // (just to test passing of resourceProps)
    const resourceProps = {
      valueProps: {
        local: false,
      },
    };

    const wrapper = shallow(
      <ConciseBoundedDescription
        store={store}
        prefixes={prefixes}
        informationResourceCollapsedRows={rows}
        resourceProps={resourceProps}
      />);

      const informationResource = wrapper.find('InformationResource');
      expect(informationResource.prop('resource')).toEqual(ex.someDocument);

      const container = informationResource.shallow();
      container.find('a.expand-collapse-information-resource[title="Expand"]')
        .simulate('click', { preventDefault: () => {} });

      expect(container.exists('div.information-resource')).toBe(true);
      expect(container.exists('a.expand-collapse-information-resource[title="Collapse"]')).toBe(true);

      expect(container.find('Resource').props()).toEqual({
        resourceIri: ex.someDocument,
        showAllProperties: true,
        disableLegacyFormatting: true,
        disableAutoLabel: true,
        hideEmptyProperties: true,
        renderHeading: true,
        resourceType: 'Metadata',
        className: 'initial-highlight',
        valueProps: resourceProps.valueProps,
        store,
        prefixes,
      });

      container.find('a').simulate('click', { preventDefault: () => {} });
      expect(container.exists('div.information-resource-collapsed')).toBe(true);

  });

  it('renders inline resource correctly', async () => {

    const store = await storeFromJsonLd(entities.concat(primaryTopicAndInformationResource));

    const wrapper = shallow(
      <ConciseBoundedDescription
        store={store}
        prefixes={prefixes}
        informationResourceCollapsedRows={rows}
      />);

      const informationResource = wrapper.find('InformationResource');
      expect(informationResource.prop('resource')).toEqual(ex.someDocument);

      const inlineResource = informationResource.shallow().find('InlineResource').shallow();
      const checkPropertySpan = (propertyPredicate: NamedNode, check: (span: ShallowWrapper) => void) =>
        check(inlineResource.find(`a[href='${propertyPredicate.value}']`).closest('span'));

      checkPropertySpan(dct.created, span => {
        expect(span.find('a').text()).toBe('dct:created');
        expect(span.find('PropertyValues').html()).toBe('<span>2020-11-01 (xsd:date)</span>');
      });
      checkPropertySpan(dct.identifier, span => {
        expect(span.find('a').text()).toBe('dct:identifier');
        expect(span.find('PropertyValues').html()).toBe('<span>DOC-ABC</span><span>, </span><span>doc-Abc</span>');
      });

  });

});
