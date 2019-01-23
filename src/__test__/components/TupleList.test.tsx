import React from 'react';
import { mount } from 'enzyme';
import TupleList, { Column, PaginationProps } from '../../components/TupleList';
import TupleResult from '../../lib/TupleResult';
import { mockBindingNames, mockBindingSets } from '../TestData';
import { Value, ValueProps } from '../..';
import { Term } from 'rdf-js';

describe('<TupleList />', () => {
  const getColumns = (): Column[] => [
    { name: 'begrip', label: 'Begrip', sortable: true },
    { name: 'definition', label: 'Definitie', sortable: true },
    { name: 'label', label: 'Label', sortable: true },
  ];

  const buildTableWithRecords = (columns: Column[], pagination?: PaginationProps, valueProps?: ValueProps) => {
    const mockTupleResult = new TupleResult();
    mockTupleResult.setTupleResult(mockBindingSets, mockBindingNames);

    return mount(
      <TupleList
        result={mockTupleResult}
        columns={columns}
        pagination={pagination}
        valueProps={valueProps}
      />,
    );
  };

  it('shows result data in a table without pager', () => {
    const columns = getColumns();
    const wrapper = buildTableWithRecords(columns);

    expect(wrapper.exists('nav')).toBe(false);

    expect(wrapper.find('table > thead > tr')).toHaveLength(1);
    columns.forEach((column, index) => {
      expect(wrapper.find('table > thead > tr > th').at(index).text()).toBe(column.label);
    });

    expect(wrapper.find('table > tbody > tr')).toHaveLength(4);
    mockBindingSets.forEach((mockBindingSet, i) => {
      const row = wrapper.find('table > tbody > tr').at(i);

      columns.forEach((column, j) => {
        const field = row.find('td').at(j);

        if (mockBindingSet[column.name] !== undefined) {
          expect(field.contains(<Value term={mockBindingSet[column.name]} />)).toBe(true);
        } else {
          expect(field.contains(<span>-</span>));
        }
      });
    });
  });

  it('changes the field rendering for a specific column when customRender is given', () => {
    const defaultRender = (term?: Term) => term !== undefined
      ? <Value term={term} />
      : <span>-</span>;

    const customRender = (term?: Term) => term !== undefined
      ? <strong>{term.value}</strong>
      : <strong>-</strong>;

    const columns = getColumns();
    columns[0].customRender = customRender;
    const wrapper = buildTableWithRecords(columns);

    mockBindingSets.forEach((mockBindingSet, i) => {
      const row = wrapper.find('table > tbody > tr').at(i);

      columns.forEach((column, j) => {
        const expected = j === 0
          ? customRender(mockBindingSet[column.name])
          : defaultRender(mockBindingSet[column.name]);

        expect(row.find('td').at(j).contains(expected)).toBe(true);
      });
    });
  });

  it('passed the valueProps to the Value component when given', () => {
    const columns = getColumns();
    const wrapper = buildTableWithRecords(columns, undefined, { local: true });

    mockBindingSets.forEach((mockBindingSet, i) => {
      const row = wrapper.find('table > tbody > tr').at(i);

      columns.forEach((column, j) => {
        const field = row.find('td').at(j);

        if (mockBindingSet[column.name] !== undefined) {
          expect(field.contains(<Value term={mockBindingSet[column.name]} local={true} />)).toBe(true);
        } else {
          expect(field.contains(<span>-</span>));
        }
      });
    });
  });

  it('shows result data in a table with default page size', () => {
    const wrapper = buildTableWithRecords(getColumns(), true);

    expect(wrapper.find('table > tbody > tr')).toHaveLength(4);
    expect(wrapper.find('nav button').first().props().disabled).toBe(true);
    expect(wrapper.find('nav button').last().props().disabled).toBe(true);
  });

  it('shows result data in a table with custom page size', () => {
    const wrapper = buildTableWithRecords(getColumns(), { pageSize: 3 });

    expect(wrapper.find('table > tbody > tr')).toHaveLength(3);
    expect(wrapper.find('nav button').first().props().disabled).toBe(true);
    expect(wrapper.find('nav button').last().props().disabled).toBe(false);
  });

  it('navigates through pages by clicking next/previous buttons', () => {
    const wrapper = buildTableWithRecords(getColumns(), { pageSize: 3 });

    wrapper.find('nav button').last().simulate('click');

    expect(wrapper.find('table > tbody > tr')).toHaveLength(1);
    expect(wrapper.find('nav button').first().props().disabled).toBe(false);
    expect(wrapper.find('nav button').last().props().disabled).toBe(true);

    wrapper.find('nav button').first().simulate('click');

    expect(wrapper.find('table > tbody > tr')).toHaveLength(3);
    expect(wrapper.find('nav button').first().props().disabled).toBe(true);
    expect(wrapper.find('nav button').last().props().disabled).toBe(false);
  });

  it('sorts the rows in ascending order', () => {
    const wrapper = buildTableWithRecords(getColumns(), { pageSize: 3 });

    wrapper.setProps({ sortedAscending: true });
    const rows = wrapper.find('table > tbody > tr');

    const firstRowColumns = rows.first().find('td').map(column => column.text());
    expect(firstRowColumns[0]).toEqual('Derde begrip');
    expect(firstRowColumns[1]).toEqual('Derde definitie');
    expect(firstRowColumns[2]).toEqual('Derde label');

    const lastRowColumns = rows.last().find('td').map(column => column.text());
    expect(lastRowColumns[0]).toEqual('Tweede begrip');
    expect(lastRowColumns[1]).toEqual('Tweede definitie');
    expect(lastRowColumns[2]).toEqual('Tweede label');
  });

  it('sorts the rows in descending order', () => {
    const wrapper = buildTableWithRecords(getColumns(), { pageSize: 3 });

    wrapper.setState({ sortedAscending: false });
    const rows = wrapper.find('table > tbody > tr');

    const lastRowColumns = rows.first().find('td').map(column => column.text());
    expect(lastRowColumns[0]).toEqual('Vierde begrip');
    expect(lastRowColumns[1]).toEqual('-');
    expect(lastRowColumns[2]).toEqual('Vierde label');

    const firstRowColumns = rows.last().find('td').map(column => column.text());
    expect(firstRowColumns[0]).toEqual('Eerste begrip');
    expect(firstRowColumns[1]).toEqual('Eerste definitie');
    expect(firstRowColumns[2]).toEqual('Eerste label');
  });
});
