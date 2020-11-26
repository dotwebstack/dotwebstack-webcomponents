import { LetterBarFilter } from '../../components/LetterBarFilter';
import { shallow, mount } from 'enzyme';
import React from 'react';

describe('<LetterBarFilter/>', () => {

  it('should render 28 selectable buttons', () => {
    const wrapper = mount(<LetterBarFilter active={true} onSelect={jest.fn}/>);
    expect(wrapper.find('button')).toHaveLength(28);
  });

  it('should return the letter as callBack', () => {
    const onSelect = jest.fn();

    const wrapper = shallow(<LetterBarFilter active={true} onSelect={onSelect}/>);

    wrapper.find('button[id="button-z"]').simulate('click');
    expect(onSelect).toHaveBeenCalledWith('z');

  });
});
