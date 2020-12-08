import { Filter, RefineSearchFilters } from '../../components/RefineSearchFilters';
import { mount, shallow } from 'enzyme';
import React from 'react';

describe('<RefineSearchFilters/>', () => {
  it('should render a select box for related search', () => {
    const wrapper = mount(<RefineSearchFilters selected={jest.fn} availableFilters={[Filter.RELATED]}/>);
    expect(wrapper.find('input[type="checkbox"]')).toHaveLength(1);
  });

  it('should return "RELATED" when checkbox for refined search value is checked', () => {
    const onSelect = jest.fn();

    const wrapper = shallow(<RefineSearchFilters selected={onSelect} availableFilters={[Filter.RELATED]}/>);

    wrapper.find('input[type="checkbox"]').simulate('change', { target: { checked: true, name: 'RELATED' } });
    expect(onSelect).toHaveBeenCalledWith(['RELATED']);
  });
});
