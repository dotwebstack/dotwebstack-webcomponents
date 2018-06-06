import React from 'react';
import { mount } from 'enzyme';
import { Badge, Table } from 'reactstrap';
import DataFactory from '../../DataFactory';
import ConnectedTupleList from '../../containers/TupleList';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { BindingSet } from '../../model';
import { Element, Link } from 'react-scroll';

const mockStore = configureStore();
let store: any;

const dataFactory = new DataFactory();
const bindingSets = [{
  begrip: dataFactory.namedNode('http://foo.basisregistraties.nl/def#foo'),
  definition: dataFactory.literal('This is a Foo'),
  label: dataFactory.literal('Foo'),
}, {
  begrip: dataFactory.namedNode('http://bar.basisregistraties.nl/def#bar'),
  definition: dataFactory.literal('This is a Bar'),
  label: dataFactory.literal('Bar'),
}, {
  begrip: dataFactory.namedNode('http://bar.basisregistraties.nl/def#3'),
  definition: dataFactory.literal('This is a 3'),
  label: dataFactory.literal('3'),
}];

const columns: any = [
  { binding: 'begrip', labelBinding: 'label', header: 'row', class: 'col-md-3' },
  { binding: 'label', header: 'row', class: 'col-md-3' },
  { binding: 'definition', class: 'col-md-9' },
];

const groupingFunction = (map: any, binding: BindingSet) => {
  const key = /\w+?(?=\.basisregistraties)|informatiehuisruimte/.exec(binding.begrip.value);

  const groupBy = key !== null ? key[0].toLocaleUpperCase() : '';
  map[groupBy] = map[groupBy] || [];
  map[groupBy].push(binding);
  return map;
};

beforeEach(() => {
  store = mockStore({ bindingSets });
});

describe('TupleListTable::render', () => {
  it('passes tableProps', () => {
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedTupleList columns={columns} tableProps={{ striped: true }}/>
      </Provider>);

    expect(wrapper.find(Table).first().prop('striped')).toBe(true);
  });

  it('tableProps are optional', () => {
    const wrapper = mount(<Provider store={store}><ConnectedTupleList columns={columns}/></Provider>);
    expect(wrapper.find(Table).first()).not.toHaveProperty('striped');
  });

  it('grouping is applied on dataset ', () => {
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedTupleList columns={columns} tableProps={{ size: 'sm' }} groupingFunction={groupingFunction}/>
      </Provider>);
    expect(wrapper.find(Element).first().prop('name')).toBe('containerBAR');
    expect(wrapper.find(Badge).first().text()).toContain('BAR');
    expect(wrapper.find(Link).first().text()).toContain('BAR');
  });

  it('defaultgrouping is applied on dataset ', () => {
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedTupleList columns={columns} tableProps={{ size: 'sm' }}/>
      </Provider>);
    expect(wrapper.find(Element).first().prop('name')).toBe('container0-9');
    expect(wrapper.find(Element).last().prop('name')).toBe('containerF');

    expect(wrapper.find(Badge).first().text()).toContain('0-9');
    expect(wrapper.find(Badge).last().text()).toContain('F');

    expect(wrapper.find(Link).first().text()).toContain('0-9');
    expect(wrapper.find(Link).last().text()).toContain('F');
  });
});
