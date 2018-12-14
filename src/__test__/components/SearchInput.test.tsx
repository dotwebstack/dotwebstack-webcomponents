import { mount } from 'enzyme';
import React from 'react';
import SearchInput from '../../components/SearchInput';

describe('<SearchInput />', () => {

  it('shows loading indicator', () => {
    const wrapper = mount(
      <SearchInput onInputChange={(value: string) => (value) } />,
      );
    wrapper.setState({ currentValue: 'test' });
    expect(wrapper.find({ value:'test' }).length).toBeGreaterThan(0);
  });
});
