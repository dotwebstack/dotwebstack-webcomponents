import { mount } from 'enzyme';
import React from 'react';
import SearchInput from '../../components/SearchInput';

describe('<SearchInput />', () => {

  it('Sets value of input based on state', () => {
    const wrapper = mount(
      <SearchInput onInputChange={(value: string) => (value) } />,
      );
    wrapper.setState({ currentValue: 'test' });
    expect(wrapper.find({ value:'test' }).length).toBeGreaterThan(0);
  });

  it('Executes onInputChange on submit', () => {
    const handleChange = jest.fn();
    const wrapper = mount(
      <SearchInput onInputChange={handleChange} />,
      );
    wrapper.find('button').simulate('submit');
    expect(handleChange).toHaveBeenCalled();
  });
});
