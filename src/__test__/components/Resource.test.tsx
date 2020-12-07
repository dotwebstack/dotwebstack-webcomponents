import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import Resource from '../../components/Resource';
import { subjectTypeRdf, quadWith1, quadWithPredicateObject2 } from '../TestData';
import { Quad, Term, NamedNode, Literal } from 'rdf-js';
import Store from '../../lib/Store';
import { namedNode, literal } from '@rdfjs/data-model';
import { RDF, DCT } from '../../namespaces';
import { localName } from '../../utils';
import { loadFromObject } from '../../lib/QuadLoader';
import { rdf, rdfs, dct, prov, xsd } from '../../vocab';

const EX = 'http://example.org/';
const ex = {
  something: namedNode(`${EX}something`),
  other: namedNode(`${EX}other`),
  another: namedNode(`${EX}another`),
  color: namedNode(`${EX}color`),
};

const createStore = (quads: Quad[]) => new Store(quads);

const storeFromJsonLd = async (data: any) => {
  return new Store(await loadFromObject(data));
};

describe('<Resource />', () => {

  it('shows predicates and objects linked to given resourceIRI', () => {
    const rows = [
      {
        predicate: namedNode(quadWith1.predicate.value),
        label: 'Property',
      },
      {
        predicate: namedNode(quadWithPredicateObject2.predicate.value),
        label: 'Type',
      },
    ];
    const wrapper = shallow(
      <Resource
        resourceIri={subjectTypeRdf}
        store={createStore([quadWith1, quadWithPredicateObject2])}
        rows={rows}
      />,
    );
    expect(wrapper.find({ href: quadWith1.predicate.value }).getElements().length)
      .toBeGreaterThan(0);
    expect(wrapper.find({ href: quadWithPredicateObject2.predicate.value }).getElements().length)
      .toBeGreaterThan(0);
  });

  it('shows the columns in given order', () => {
    const rows = [
      {
        predicate: namedNode(quadWithPredicateObject2.predicate.value),
        label: 'Type',
      },
      {
        predicate: namedNode(quadWith1.predicate.value),
        label: 'Property',
      },
    ];

    const wrapper = shallow(
      <Resource
        resourceIri={subjectTypeRdf}
        store={createStore([quadWith1, quadWithPredicateObject2])}
        rows={rows}
      />,
    );

    expect(wrapper.find('th').first().find('a').text()).toEqual('Type');
    expect(wrapper.find('th').last().find('a').text()).toEqual('Property');
  });

  it('shows a dash when no statements are found', () => {
    const rows = [
      {
        predicate: namedNode('http://example.org/nostatements'),
        label: 'Type',
      },
    ];

    const wrapper = shallow(
      <Resource
        resourceIri={subjectTypeRdf}
        store={createStore([quadWith1, quadWithPredicateObject2])}
        rows={rows}
      />,
    );
    expect(wrapper.find('PropertyValues').shallow()
      .find('span').text()).toEqual('-');
  });

  it('shows localName when no label is given', () => {
    const rows = [
      {
        predicate: namedNode(quadWithPredicateObject2.predicate.value),
      },
      {
        predicate: namedNode(quadWith1.predicate.value),
      },
    ];

    const wrapper = shallow(
      <Resource
        resourceIri={subjectTypeRdf}
        store={createStore([quadWith1, quadWithPredicateObject2])}
        rows={rows}
      />,
    );
    expect(wrapper.find('th').first().find('a').text()).toEqual(localName(quadWithPredicateObject2.predicate));
    expect(wrapper.find('th').last().find('a').text()).toEqual(localName(quadWith1.predicate));
  });

  it('can render a custom styling', () => {
    const rows = [{
      predicate: namedNode(RDF + 'Property'),
      label: 'Is defined by',
      customRender: (terms: Term[]) => {
        return (
          <div>
            {terms.map(term =>
              <h1 key={term.value}>
                {term.value}
              </h1>,
            )}
          </div>
        );
      },
    }];

    const wrapper = shallow(
      <Resource
        resourceIri={subjectTypeRdf}
        store={createStore([quadWith1, quadWithPredicateObject2])}
        rows={rows}
      />,
    );

    expect(wrapper.find('PropertyValues').shallow()
      .find('h1').text()).toEqual(quadWith1.object.value);
  });

  const checkRow = (wrapper: ShallowWrapper, propertyHref: string,
    callback: (aElement: ShallowWrapper, valuesElement: ShallowWrapper) => void) => {

    // propertyHref is used as a key to find the desired property row
    const row = wrapper.find(`a[href='${propertyHref}']`).closest('tr');
    callback(row.find('a'), row.find('PropertyValues'));
  };

  it('renders all properties if rows are not specified', async () => {

    const store = await storeFromJsonLd({
      '@id': ex.something.value,
      '@type': prov.Entity.value,
      [dct.description.value]: 'The best entity',
    });

    const wrapper = shallow(
      <Resource
        resourceIri={ex.something}
        store={store}
      />);

    checkRow(wrapper, dct.description.value, (a, values) => {
      expect(a.text()).toBe('description');
      expect(values.prop('property')).toEqual({
        path: {
          predicate: dct.description,
          inverse: false,
        },
        values: [ literal('The best entity') ],
      });
    });

    checkRow(wrapper, rdf.type.value, (a, values) => {
      expect(a.text()).toBe('type');
      expect(values.prop('property')).toEqual({
        path: {
          predicate: rdf.type,
          inverse: false,
        },
        values: [ prov.Entity ],
      });
    });
  });

  const entities = [{
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
      }
    ],
  }, {
    '@id': ex.another.value,
    '@type': prov.Entity.value,
    [dct.hasVersion.value]: { '@id': ex.something.value },
    [rdfs.label.value]: 'Another thing',
  }];

  it('renders (inverse) properties in correct order', async () => {

    const store = await storeFromJsonLd(entities);
    
    const wrapper = shallow(
      <Resource
        resourceIri={ex.something}
        store={store}
      />);

    expect(wrapper.find('a').map(a => a.prop('href'))).toEqual([
      ex.color.value,
      dct.created.value,
      dct.description.value,
      dct.identifier.value,
      dct.title.value,
      rdf.type.value,
      // inverse properties are last
      dct.hasVersion.value,
      dct.isReplacedBy.value,
    ]);
  });

  it('renders inverse properties correctly', async () => {

    const store = await storeFromJsonLd(entities);
    
    const wrapper = shallow(
      <Resource
        resourceIri={ex.something}
        store={store}
      />);

    checkRow(wrapper, dct.hasVersion.value, (a, values) => {
      expect(a.text()).toBe('is hasVersion of');
      expect(values.prop('property')).toEqual({
        path: {
          predicate: dct.hasVersion,
          inverse: true,
        },
        values: [ ex.another ],
      });
    });

    checkRow(wrapper, dct.isReplacedBy.value, (a, values) => {
      expect(a.text()).toBe('is isReplacedBy of');
      expect(values.prop('property')).toEqual({
        path: {
          predicate: dct.isReplacedBy,
          inverse: true,
        },
        values: [ ex.other ],
      });
    });
  });

  it('renders predicate label specified in row mapping', async () => {

    const store = await storeFromJsonLd(entities);
    
    const rows = [{
      predicate: rdf.type,
      label: 'the type',
    }, {
      predicate: dct.title,
    }];

    const wrapper = shallow(
      <Resource
        resourceIri={ex.something}
        store={store}
        rows={rows}
      />);

    checkRow(wrapper, rdf.type.value, a =>
      expect(a.text()).toBe('the type'));
    checkRow(wrapper, dct.title.value, a =>
      expect(a.text()).toBe('title'));
  });

  it('hides empty properties, if configured, but leaves those with custom render', async () => {

    const store = await storeFromJsonLd(entities);
    
    const rows = [{
      predicate: dct.replaces, // not present in data
      customRender: () => <span>a, b, c</span>,
    }, {
      predicate: dct.publisher, // not present in data
    }];

    const wrapper = shallow(
      <Resource
        resourceIri={ex.something}
        store={store}
        hideEmptyProperties
        rows={rows}
      />);

    checkRow(wrapper, dct.replaces.value, (a, values) => {
      expect(a.text()).toBe('replaces');
      expect(values.shallow().html()).toEqual('<span>a, b, c</span>');
    });

    expect(wrapper.find(`a[href='${dct.publisher.value}']`).exists()).toBe(false);

  });

  it('does not show all properties if rows are specified', async () => {

    const store = await storeFromJsonLd(entities);
    
    const rows = [{
      predicate: dct.replaces,
    }, {
      predicate: dct.publisher,
    }];

    const wrapper = shallow(
      <Resource
        resourceIri={ex.something}
        store={store}
        rows={rows}
      />);

    expect(wrapper.find('a')).toHaveLength(2);

  });

  it('shows all properties if rows are specified and flag is set', async () => {

    const store = await storeFromJsonLd(entities);
    
    const rows = [{
      predicate: dct.replaces,
    }, {
      predicate: dct.publisher,
    }];

    const wrapper = shallow(
      <Resource
        resourceIri={ex.something}
        store={store}
        rows={rows}
        showAllProperties
      />);

    expect(wrapper.find('a')).toHaveLength(10);

  });

  it('filters properties if configured, but not those of row mapping', async () => {

    const store = await storeFromJsonLd(entities);
    
    const rows = [{
      predicate: dct.title,
    }];

    // manually exclude a few properties
    const includeProperty = (predicate: string, inverse: boolean) => {
      if (predicate === dct.hasVersion.value && inverse) { return false; }
      if (predicate === dct.identifier.value && !inverse) { return false; }

      // should NOT work, since it *is* inverse in our data
      if (predicate === dct.isReplacedBy.value && !inverse) { return false; }

      // should NOT work, since the predicate is specified in the row mapping
      if (predicate === dct.title.value && !inverse) { return false; }
      return true;
    };

    const wrapper = shallow(
      <Resource
        resourceIri={ex.something}
        store={store}
        rows={rows}
        showAllProperties
        includeProperty={includeProperty}
      />);

    expect(wrapper.find('a')).toHaveLength(6);
    expect(wrapper.find('a').map(a => a.prop('href'))).toEqual([
      dct.title.value,
      ex.color.value,
      dct.created.value,
      dct.description.value,
      rdf.type.value,
      dct.isReplacedBy.value,
    ]);
  });

  it('shortens property labels when autolabel is disabled', async () => {

    const store = await storeFromJsonLd(entities);
    
    const rows = [{
      predicate: dct.title,
    }];

    const prefixes = {
      xyz: EX,
    };

    const wrapper = shallow(
      <Resource
        resourceIri={ex.something}
        store={store}
        rows={rows}
        showAllProperties
        disableAutoLabel
        prefixes={prefixes}
      />);

    checkRow(wrapper, dct.title.value, a =>
      expect(a.text()).toBe('dct:title'));

    checkRow(wrapper, dct.created.value, a =>
      expect(a.text()).toBe('dct:created'));

    checkRow(wrapper, ex.color.value, a =>
      expect(a.text()).toBe('xyz:color'));

  });

  it('uses custom predicate formatter, but falls back to default for null result', async () => {

    const store = await storeFromJsonLd(entities);
    
    const prefixes = {
      abc: EX,
    };

    const formatPredicate = (predicate: string, inverse: boolean, shorten: (resource: string) => string) => {
      if (inverse) {
        return null; // defer to default implementation
      }
      if (predicate.startsWith(DCT)) {
        const name = shorten(predicate); // use provided shortener
        return `${name} (dcterms)`;
      }
      return null;
    };
    
    const wrapper = shallow(
      <Resource
        resourceIri={ex.something}
        store={store}
        disableAutoLabel
        prefixes={prefixes}
        formatPredicate={formatPredicate}
      />);

    checkRow(wrapper, dct.hasVersion.value, a =>
      expect(a.text()).toBe('is dct:hasVersion of')); // we deferred to default implementation

    checkRow(wrapper, dct.title.value, a =>
      expect(a.text()).toBe('dct:title (dcterms)'));

    checkRow(wrapper, ex.color.value, a =>
      expect(a.text()).toBe('abc:color'));

  });

  const checkValue = (wrapper: ShallowWrapper, propertyHref: string,
    callback: (valueElement: ShallowWrapper) => void) => {

    // propertyHref is used as a key to find the desired property row
    const row = wrapper.find(`a[href='${propertyHref}']`).closest('tr');
    callback(row.find('PropertyValues').shallow().find('Value'));
  };

  it('renders Value components correctly', async () => {

    const store = await storeFromJsonLd(entities);
    
    const prefixes = {
      abc: EX,
    };

    const wrapper = shallow(
      <Resource
        resourceIri={ex.something}
        store={store}
        disableAutoLabel
        prefixes={prefixes}
      />);

    const testGetNamedNodeLabels = (getNamedNodeLabels: (resource: NamedNode) => Literal[]) => {
      expect(getNamedNodeLabels(ex.other)).toEqual([
        literal('Other thing'),
        literal('Ander ding', 'nl'),
      ]);
      expect(getNamedNodeLabels(ex.another)).toEqual([
        literal('Another thing')
      ]);
    };

    checkValue(wrapper, dct.title.value, value => {
      expect(value.prop('term')).toEqual(literal('2nd Best'));
      expect(value.prop('prefixes')).toEqual(prefixes);
      expect(value.prop('disableLegacyFormatting')).toBe(false); // default value
      testGetNamedNodeLabels(value.prop('getNamedNodeLabels'));
    });

    checkValue(wrapper, ex.color.value, value =>
      expect(value.prop('term')).toEqual(literal('yellow')));
    checkValue(wrapper, dct.created.value, value =>
      expect(value.prop('term')).toEqual(literal('2020-12-01', xsd.date)));
    checkValue(wrapper, dct.description.value, value =>
      expect(value.prop('term')).toEqual(literal('The second best entity')));
    checkValue(wrapper, dct.identifier.value, value =>
      expect(value.prop('term')).toEqual(literal('10082.82', xsd.decimal)));
    checkValue(wrapper, rdf.type.value, value =>
      expect(value.prop('term')).toEqual(prov.Entity));
    checkValue(wrapper, dct.hasVersion.value, value =>
      expect(value.prop('term')).toEqual(ex.another));
    checkValue(wrapper, dct.isReplacedBy.value, value =>
      expect(value.prop('term')).toEqual(ex.other));

  });

  it('renders Value components correctly (valueProps, disableLegacyFormatting)', async () => {

    const store = await storeFromJsonLd(entities);
    
    const prefixes = {
      abc: EX,
    };

    const valuePrefixes = {
      xyz: 'http://xyz.org/data/'
    };

    const valueProps = {
      local: true,
      prefixes: valuePrefixes,
    };

    const wrapper = shallow(
      <Resource
        resourceIri={ex.something}
        store={store}
        disableAutoLabel
        prefixes={prefixes}
        disableLegacyFormatting
        valueProps={valueProps}
      />);

    checkValue(wrapper, dct.title.value, value => {
      expect(value.prop('term')).toEqual(literal('2nd Best'));
      expect(value.prop('prefixes')).toEqual(valuePrefixes); // prefixes is 'overwritten' by valueProps.prefixes
      expect(value.prop('disableLegacyFormatting')).toBe(true);
      expect(value.prop('local')).toBe(true);
    });
  });

});
