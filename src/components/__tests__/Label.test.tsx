import * as React from 'react';
import { shallow } from 'enzyme';
import { Label, mapStateToProps } from '../Label';
import DataFactory from '../../DataFactory';

const dataFactory = new DataFactory();
const resource = dataFactory.namedNode('foo');

describe('Label', () => {
  it('should render without throwing an error', () => {
    const resource = dataFactory.namedNode('foo');
    const wrapper = shallow(<Label resource={resource} value="bar" />);
    expect(wrapper.contains(<React.Fragment>bar</React.Fragment>)).toEqual(true);
  });
});

describe('Label::mapStateToProps', () => {
  it('should set the resource IRI as props.value when no label found in default graph', () => {
    const state = {
      quads: [
        dataFactory.quad(
          resource,
          dataFactory.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
          dataFactory.literal('foo'),
          dataFactory.namedNode('bar'),
        ),
      ],
      loading: false,
    };

    const props = mapStateToProps(state, { resource });
    expect(props.value).toEqual(resource.value);
  });

  it('should set the rdfs:label object as props.value when found in default graph', () => {
    const state = {
      quads: [
        dataFactory.quad(
          resource,
          dataFactory.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
          dataFactory.literal('foo'),
        ),
      ],
      loading: false,
    };

    const props = mapStateToProps(state, { resource });
    expect(props.value).toEqual('foo');
  });

  it('should set the rdfs:label object as props.value when found in named graph', () => {
    const graph = dataFactory.namedNode('bar');

    const state = {
      quads: [
        dataFactory.quad(
          resource,
          dataFactory.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
          dataFactory.literal('foo'),
          graph,
        ),
      ],
      loading: false,
    };

    const props = mapStateToProps(state, { resource, graph });
    expect(props.value).toEqual('foo');
  });
});
