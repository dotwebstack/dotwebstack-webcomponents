import { shallow } from 'enzyme';
import React from 'react';
import GraphSearch from '../../components/GraphSearch';

describe('<GraphSearch />', () => {

  it('shows search field', () => {
    const wrapper = shallow(
    <GraphSearch endpoint={'http://example.org'}
      children={tupleResult => (
          <React.Component tupleResult={tupleResult} />
      )} />);
    expect(wrapper.html()).toMatch('input type="text"');
  });

  it('shows loading indicator', () => {
    const wrapper = shallow(
    <GraphSearch endpoint={'http://example.org'}
      children={tupleResult => (
          <React.Component tupleResult={tupleResult} />
      )} />);
    wrapper.setState({ searching: true });
    expect(wrapper.html()).toMatch('Loading data...');
  });

  it('Synchronises state and form value', () => {
    const wrapper = shallow(
    <GraphSearch endpoint={'http://example.org'}
      children={tupleResult => (
          <React.Component tupleResult={tupleResult} />
      )} />);
    wrapper.setState({ searchTerm:'test' });
    expect(wrapper.find({ name: 'Search' }).html()).toMatch('value="test"');
  });
});
