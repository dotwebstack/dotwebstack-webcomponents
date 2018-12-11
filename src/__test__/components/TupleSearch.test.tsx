import { shallow } from 'enzyme';
import React from 'react';
import { Column } from '../../components/TupleList';
import TupleSearch from '../../components/TupleSearch';

describe('<TupleSearch />', () => {

  const columns: Column[] = [
    { name: 'resource', label: 'URL' },
    { name: 'resource_label', label: 'What?' },
    { name: 'explain', label: 'Explain' },
  ];

  it('shows search field', () => {
    const wrapper = shallow(
    <TupleSearch endpoint={'http://example.org'}
      children={tupleResult => (
          <React.Component tupleResult={tupleResult} />
      )} columns={columns} />);
    expect(wrapper.html()).toMatch('input type="text"');
  });

  it('shows loading indicator', () => {
    const wrapper = shallow(
    <TupleSearch endpoint={'http://example.org'}
      children={tupleResult => (
          <React.Component tupleResult={tupleResult} />
      )} columns={columns} />);
    wrapper.setState({ searching: true });
    expect(wrapper.html()).toMatch('Loading data...');
  });

  it('Synchronises state and form value', () => {
    const wrapper = shallow(
    <TupleSearch endpoint={'http://example.org'}
      children={tupleResult => (
          <React.Component tupleResult={tupleResult} />
      )} columns={columns} />);
    wrapper.setState({ searchTerm:'test' });
    expect(wrapper.find({ name: 'Search' }).html()).toMatch('value="test"');
  });
});
