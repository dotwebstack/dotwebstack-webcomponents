import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import TupleList, { Column } from '../../components/TupleList';
import TupleResult from '../../lib/TupleResult';
import { mockBindingNames, mockBindingSet } from '../TestData';
import { Term } from 'rdf-js';

describe('<TupleList />', () => {

  let table: ReactWrapper;
  let emptyTable: ReactWrapper;
  let mockTupleResult: TupleResult;
  const pageSize = 3;
  const headerSize = 1;

  const columns: Column[] = [
    { name: 'begrip', label: 'Begrip' },
    { name: 'definition', label: 'Definitie' },
    { name: 'label', label: 'Label' },
  ];

  it('shows result data in a table', () => {
    const table = buildTableWith4Records();
    const data = table.children().props().data;

    expect(data[0].begrip.value).toEqual(mockBindingSet[0].begrip.value);
    expect(data[0].definition.value).toEqual(mockBindingSet[0].definition.value);
    expect(data[0].label.value).toEqual(mockBindingSet[0].label.value);

    expect(data[1].begrip.value).toEqual(mockBindingSet[1].begrip.value);
    expect(data[1].definition.value).toEqual(mockBindingSet[1].definition.value);
    expect(data[1].label.value).toEqual(mockBindingSet[1].label.value);

    expect(data[2].begrip.value).toEqual(mockBindingSet[2].begrip.value);
    expect(data[2].definition.value).toEqual(mockBindingSet[2].definition.value);
    expect(data[2].label.value).toEqual(mockBindingSet[2].label.value);

    expect(data[3].begrip.value).toEqual(mockBindingSet[3].begrip.value);
    expect(data[3].definition.value).toEqual(mockBindingSet[3].definition.value);
    expect(data[3].label.value).toEqual(mockBindingSet[3].label.value);
  });

  it('shows an empty table when no results', () => {
    emptyTable = buildEmptyTable();
    expect(emptyTable.children().props().data.length).toBe(0);
  });

  it('shows the columns in given order', () => {
    table = buildTableWith4Records();

    expect(table.find('th').first().text()).toEqual('Begrip');
    expect(table.find('th').last().text()).toEqual('Label');
  });

  it('shows pagination', () => {
    table = buildTableWith4Records();
    expect(table.children().props().pagination).toBeTruthy();

    emptyTable = buildEmptyTable();
    expect(emptyTable.children().props().pagination).toBeFalsy();
  });

  it('shows correct number of rows according to pageSize', () => {
    table = buildTableWith4Records();
    expect(table.find('tr').length).toEqual(headerSize + pageSize);
  });

  it('can render a custom styling', () => {
    table = buildTableWithStyle();
    expect(table.find('h1').first().text()).toEqual('Eerste label');
  });

  function buildTableWith4Records() {
    mockTupleResult = new TupleResult();
    mockTupleResult.setTupleResult(mockBindingSet, mockBindingNames);

    return table = mount(
      <TupleList
        result={ mockTupleResult }
        columns={ columns }
        pageSize={ pageSize }
      />);
  }

  function buildTableWithStyle() {
    const columnsWithStyle: Column[] = [
      { name: 'label', label: 'Label',
        customRender: (term: Term) => {
          return (<h1>{term.value}</h1>);
        },
      },
    ];

    mockTupleResult = new TupleResult();
    mockTupleResult.setTupleResult(mockBindingSet, mockBindingNames);

    return table = mount(
      <TupleList
        result={ mockTupleResult }
        columns={ columnsWithStyle }
        pageSize={ pageSize }
      />);
  }

  function buildEmptyTable() {
    const emptyTupleResult = new TupleResult();
    return emptyTable = mount(
      <TupleList
        result={ emptyTupleResult }
        columns={ columns }
        pageSize={ pageSize }
      />);
  }
});
