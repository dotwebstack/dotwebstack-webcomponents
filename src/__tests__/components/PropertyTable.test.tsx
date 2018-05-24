import React from 'react';
import { shallow } from 'enzyme';
import { Table } from 'reactstrap';
import DataFactory from '../../DataFactory';
import PropertyTable from '../../components/PropertyTable';

const dataFactory = new DataFactory();

describe('PropertyTable::render', () => {
  it('should pass table props when given', () => {
    const wrapper = shallow(<PropertyTable quads={[]} tableProps={{ striped: true }} />);
    expect(wrapper.find(Table).prop('striped')).toEqual(true);
  });

  it('should render predicate-literal pairs', () => {
    const wrapper = shallow(<PropertyTable quads={[
      dataFactory.quad(
        dataFactory.namedNode('foo'),
        dataFactory.namedNode('bar'),
        dataFactory.literal('baz'),
      ),
    ]} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render predicate-node pairs', () => {
    const wrapper = shallow(<PropertyTable quads={[
      dataFactory.quad(
        dataFactory.namedNode('foo'),
        dataFactory.namedNode('bar'),
        dataFactory.namedNode('baz'),
      ),
    ]} />);
    expect(wrapper).toMatchSnapshot();
  });
});
