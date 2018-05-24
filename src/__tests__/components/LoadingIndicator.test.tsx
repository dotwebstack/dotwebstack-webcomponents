import React from 'react';
import { shallow } from 'enzyme';
import LoadingIndicator from '../../components/LoadingIndicator';

describe('LoadingIndicator::render', () => {
  it('should render without throwing an error', () => {
    const wrapper = shallow(<LoadingIndicator />);
    expect(wrapper.contains(<p>Loading data...</p>)).toEqual(true);
  });
});
