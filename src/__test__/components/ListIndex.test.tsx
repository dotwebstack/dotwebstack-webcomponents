import { shallow } from 'enzyme';
import React from 'react';
import ListIndex from '../../components/ListIndex';
import { objectTest1, objectTest2 } from '../TestData';
import { localName } from '../../utils';

describe('<ListIndex />', () => {
  it('Returns list linking to multiple IRIs', () => {
    const wrapper = shallow(<ListIndex resourceIris={[objectTest1, objectTest2]}
      />);
    expect(wrapper.find({ href: '#' + localName(objectTest1) })
    .getElements().length).toBeGreaterThan(0);
    expect(wrapper.find({ href: '#' + localName(objectTest2) })
    .getElements().length).toBeGreaterThan(0);
  });

  it('Returns empty HTML list when no IRIs provided', () => {
    const wrapper = shallow(<ListIndex resourceIris={[]}
      />);
    expect(wrapper.find('ul>li')
    .getElements().length).toEqual(0);
  });
});
