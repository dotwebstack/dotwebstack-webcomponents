import { shallow } from 'enzyme';
import React from 'react';
import Resource from '../../components/Resource';
import { subjectTypeRdf, quadWith1, quadWithPredicateObject2 } from '../TestData';
import { Quad, Term } from 'rdf-js';
import Store from '../../lib/Store';
import { namedNode } from '@rdfjs/data-model';
import { RDF } from '../../namespaces';
import { localName } from '../../utils';

function createStore(quads: Quad[]) {
  return new Store(quads);
}

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
    expect(wrapper.find({ href: quadWith1.predicate.value }).getElements().length).toBeGreaterThan(
      0,
    );
    expect(
      wrapper.find({ href: quadWithPredicateObject2.predicate.value }).getElements().length,
    ).toBeGreaterThan(0);
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

    expect(
      wrapper
        .find('th')
        .first()
        .find('a')
        .text(),
    ).toEqual('Type');
    expect(
      wrapper
        .find('th')
        .last()
        .find('a')
        .text(),
    ).toEqual('Property');
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
    expect(wrapper.find('span').text()).toEqual('-');
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
    expect(
      wrapper
        .find('th')
        .first()
        .find('a')
        .text(),
    ).toEqual(localName(quadWithPredicateObject2.predicate));
    expect(
      wrapper
        .find('th')
        .last()
        .find('a')
        .text(),
    ).toEqual(localName(quadWith1.predicate));
  });

  it('can render a custom styling', () => {
    const rows = [
      {
        predicate: namedNode(RDF + 'Property'),
        label: 'Is defined by',
        customRender: (terms: Term[]) => {
          return (
            <div>
              {terms.map(term => (
                <h1 key={term.value}>{term.value}</h1>
              ))}
            </div>
          );
        },
      },
    ];

    const wrapper = shallow(
      <Resource
        resourceIri={subjectTypeRdf}
        store={createStore([quadWith1, quadWithPredicateObject2])}
        rows={rows}
      />,
    );

    expect(wrapper.find('h1').text()).toEqual(quadWith1.object.value);
  });

  it('shows URI as clickable link when showURI is true', () => {
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
        showUri={true}
      />,
    );
    expect(wrapper.find({ href: subjectTypeRdf.value }).text()).toEqual(subjectTypeRdf.value);
  });

  it('does not show URI as clickable link when showURI is not set', () => {
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
    expect(wrapper.find({ href: subjectTypeRdf.value }).length).toEqual(0);
  });
});
