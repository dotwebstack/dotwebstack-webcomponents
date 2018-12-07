import { shallow } from 'enzyme';
import React from 'react';
import Search from '../../components/Search';
import { Column } from '../../components/TupleList';

describe('<TupleContext />', () => {

  const columns: Column[] = [
    { name: 'resource', label: 'URL' },
    { name: 'resource_label', label: 'What?' },
    { name: 'explain', label: 'Explain' },
  ];

  it('shows search field', () => {
    const wrapper = shallow(
    <Search endpoint={'http://example.org'}
      children={tupleResult => (
          <React.Component tupleResult={tupleResult} />
      )} columns={columns} />);
    expect(wrapper.html()).toMatch('input type="text"');
  });

  it('shows loading indicator', () => {
    const wrapper = shallow(
    <Search endpoint={'http://example.org'}
      children={tupleResult => (
          <React.Component tupleResult={tupleResult} />
      )} columns={columns} />);
    wrapper.setState({ searching: true });
    expect(wrapper.html()).toMatch('Loading data...');
  });

  it('Synchronises state and form value', () => {
    const wrapper = shallow(
    <Search endpoint={'http://example.org'}
      children={tupleResult => (
          <React.Component tupleResult={tupleResult} />
      )} columns={columns} />);
    // wrapper.find({  });
    wrapper.setState({ searchTerm:'test' });
    expect(wrapper.find({ name: 'Search' }).html()).toMatch('value="test"');
  });
});
