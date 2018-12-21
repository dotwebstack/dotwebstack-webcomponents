import { mount } from 'enzyme';
import React from 'react';
import SearchInput from '../../components/SearchInput';

describe('<SearchInput />', () => {

  it('Sets value of input based on state', () => {
    const wrapper = mount(
      <SearchInput onInputChange={(value: string) => (value) } />,
      );
    wrapper.find('input').simulate('change', { target: { value: 'testinput' } });
    expect(wrapper.find({ value:'testinput' }).length).toBeGreaterThan(0);
  });

  it('Executes onInputChange on submit', () => {
    const handleChange = jest.fn();
    const wrapper = mount(
      <SearchInput onInputChange={handleChange} />,
      );
    expect(handleChange).not.toHaveBeenCalled();
    wrapper.find('button').simulate('submit');
    expect(handleChange).toHaveBeenCalled();
  });

  it('checks if value is submitted when ', () => {
    const handleInputChange = jest.fn();
    const wrapper = mount(
      <SearchInput onInputChange={handleInputChange} />,
    );
    expect(handleInputChange).not.toHaveBeenCalled();
    wrapper.find('input').simulate('change', { target: { value: 'testinput' } });
    expect(handleInputChange).not.toHaveBeenCalled();
    wrapper.find('form').simulate('submit');
    expect(handleInputChange).toHaveBeenCalledWith('testinput');
  });
});
