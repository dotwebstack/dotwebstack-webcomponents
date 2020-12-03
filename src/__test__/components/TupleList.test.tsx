import React from 'react';
import { mount } from 'enzyme';
import TupleList, { Column, AlphabetIndexBarProps, PaginationProps, SearchListProps } from '../../components/TupleList';
import TupleResult from '../../lib/TupleResult';
import { mockBindingNames, mockBindingSets } from '../TestData';
import { Value, ValueProps } from '../..';
import { Term } from 'rdf-js';
import { SuggestProps } from '../../components/SearchInput';
import { FilterConfig } from '../../components/RefineSearchFilters';

describe('<TupleList />', () => {
  const getColumns = (): Column[] => [
    { name: 'begrip', label: 'Begrip', sortable: true },
    { name: 'definition', label: 'Definitie', sortable: true },
    { name: 'label', label: 'Label', sortable: true },
  ];

  const mockTupleResult = new TupleResult();
  mockTupleResult.setTupleResult(mockBindingSets, mockBindingNames);

  const buildTableWithRecords = (columns: Column[], pagination?: PaginationProps, valueProps?: ValueProps,
                                 suggest?: SuggestProps, search?: SearchListProps,
                                 alphabetIndexBar?: AlphabetIndexBarProps, filterConfig?: FilterConfig) => {

    return mount(
      <TupleList
        suggest={suggest}
        search={search}
        alphabeticIndexBar={alphabetIndexBar}
        filterConfig={filterConfig}
        result={mockTupleResult}
        columns={columns}
        pagination={pagination}
        valueProps={valueProps}
        sortByColumn={['begrip', true]}
      />,
    );
  };

  it('shows result data in a table without pager', () => {
    const columns = getColumns();
    const wrapper = buildTableWithRecords(columns);

    expect(wrapper.exists('nav')).toBe(false);

    expect(wrapper.find('table > thead > tr')).toHaveLength(1);
    columns.forEach((column, index) => {
      expect(wrapper.find('table > thead > tr > th').at(index).text()).toContain(column.label);
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

  it('should not show search by default', () => {
    const wrapper = buildTableWithRecords(getColumns());

    expect(wrapper.find('input[type="search"]')).toHaveLength(0);
  });

  it('shows a search input in order to filter tuple list', () => {
    const wrapper = buildTableWithRecords(getColumns(), undefined, undefined, undefined, { instant: true, fields: ['begrip'] });

    expect(wrapper.find('input[type="search"]')).toHaveLength(1);
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
    const wrapper = buildTableWithRecords(getColumns(), { pageSize: 10 });

    wrapper.setState({ sortByColumn: ['begrip', true] });
    const rows = wrapper.find('table > tbody > tr');

    const firstRowColumns = rows.first().find('td').map(column => column.text());
    expect(firstRowColumns[0]).toEqual('Derde begrip');
    expect(firstRowColumns[1]).toEqual('Derde definitie');
    expect(firstRowColumns[2]).toEqual('Derde label');

    const lastRowColumns = rows.last().find('td').map(column => column.text());
    expect(lastRowColumns[0]).toEqual('Vierde begrip');
    expect(lastRowColumns[1]).toEqual('-');
    expect(lastRowColumns[2]).toEqual('Vierde label');
  });

  it('sorts the rows in descending order', () => {
    const wrapper = buildTableWithRecords(getColumns(), { pageSize: 10 });

    wrapper.setState({ sortByColumn: ['begrip', false] });
    const rows = wrapper.find('table > tbody > tr');

    const lastRowColumns = rows.first().find('td').map(column => column.text());
    expect(lastRowColumns[0]).toEqual('Vierde begrip');
    expect(lastRowColumns[1]).toEqual('-');
    expect(lastRowColumns[2]).toEqual('Vierde label');

    const firstRowColumns = rows.last().find('td').map(column => column.text());
    expect(firstRowColumns[0]).toEqual('Derde begrip');
    expect(firstRowColumns[1]).toEqual('Derde definitie');
    expect(firstRowColumns[2]).toEqual('Derde label');
  });

  it('filters results based on search input', () => {
    const wrapper = buildTableWithRecords(getColumns(), { pageSize: 10 }, undefined,
                                          { suggestions: [mockTupleResult, 'begrip'] },
                                          { fields: ['begrip'], instant: true });

    wrapper.setState({ searchString: 'derde' });

    const rows = wrapper.find('table > tbody > tr');

    expect(rows).toHaveLength(1);
  });

  it('should filter results based on letterbar filter', () => {
    const wrapper = buildTableWithRecords(getColumns(), { pageSize: 10 }, undefined,
                                          undefined, undefined, { field: 'begrip' });

    wrapper.find('button[id="button-e"]').simulate('click');
    const rows = wrapper.find('table > tbody > tr');
    expect(rows).toHaveLength(1);
    expect(rows.first().find('td:first-child').text()).toBe('Eerste begrip');
  });

  it('should include related items when refined filter is enabled', () => {
    const wrapper = buildTableWithRecords(getColumns(), { pageSize: 10 }, undefined,
                                          undefined, { fields: ['begrip'], instant: true }, undefined,
                                          { RELATED: { referenceField:'begrip', relatedFields: ['related'] } });
    // simulate search input
    wrapper.find('input[type="search"]').simulate('change', { target: { value: 'Derde' } });
    let rows = wrapper.find('table > tbody > tr');
    expect(rows).toHaveLength(1);
    expect(rows.first().find('td:first-child').text()).toBe('Derde begrip');

    // enable related items
    wrapper.find('input[type="checkbox"]').simulate('change', { target: { checked: true, name: 'RELATED' } });
    rows = wrapper.find('table > tbody > tr');
    expect(rows).toHaveLength(2);
    expect(rows.at(0).find('td').at(0).text()).toBe('Derde begrip');
    expect(rows.at(1).find('td').at(0).text()).toBe('Eerste begrip');
  });
});
