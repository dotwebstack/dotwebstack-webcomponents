import React from 'react';
import { shallow } from 'enzyme';
import { Table } from 'reactstrap';
import DataFactory from '../../DataFactory';
import TupleListTable from '../../components/TupleListTable';

const dataFactory = new DataFactory();
const bindingSets = [{
  begrip: dataFactory.namedNode('http://www.foo.nl/def#foo'),
  definition: dataFactory.literal('This is a Foo'),
  label: dataFactory.literal('Foo'),
}];

const columns: any = [
  { binding: 'begrip', labelBinding: 'label', header: 'row', class: 'col-md-3' },
  { binding: 'begrip', header: 'row', class: 'col-md-3' },
  { binding: 'definition', class: 'col-md-9' },
];

const tableProps = { striped: true };

describe('TupleListTable::render', () => {
  it('passes tableProps', () => {
    const wrapper = shallow(<TupleListTable bindingSets={bindingSets} columns={columns} tableProps={tableProps}/>);

    expect(wrapper.find(Table).prop('striped')).toEqual(true);
  });

  it('tableProps are optional', () => {
    const wrapper = shallow(<TupleListTable bindingSets={bindingSets} columns={columns}/>);
    expect(wrapper.find(Table)).not.toHaveProperty('striped');
  });
});
