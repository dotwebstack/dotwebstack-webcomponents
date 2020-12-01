import { AlphabetIndexBar } from '../../components/AlphabetIndexBar';
import { shallow, mount } from 'enzyme';
import React from 'react';

describe('<AlphabetIndexBar/>', () => {

  it('should render 28 selectable buttons', () => {
    const wrapper = mount(<AlphabetIndexBar active={true} onSelect={jest.fn}/>);
    expect(wrapper.find('button')).toHaveLength(28);
  });

  it('should return the letter as callBack', () => {
    const onSelect = jest.fn();

    const wrapper = shallow(<AlphabetIndexBar active={true} onSelect={onSelect}/>);

    wrapper.find('button[id="button-z"]').simulate('click');
    expect(onSelect).toHaveBeenCalledWith('z');

  });
});
