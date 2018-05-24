import React from 'react';
import { shallow } from 'enzyme';
import { ContextWrapper, StateProps, mapStateToProps } from '../../containers/ContextWrapper';
import LoadingIndicator from '../../components/LoadingIndicator';

describe('ContextWrapper::render', () => {
  it('renders loading indicator when loading is true', () => {
    const wrapper = shallow(<ContextWrapper loading={true}><div /></ContextWrapper>);
    expect(wrapper.contains(<LoadingIndicator />)).toEqual(true);
  });

  it('renders the children when loading is false', () => {
    const wrapper = shallow(<ContextWrapper loading={false}><div /></ContextWrapper>);
    expect(wrapper.contains(<React.Fragment><div /></React.Fragment>)).toEqual(true);
  });
});

describe('ContextWrapper::mapStateToProps', () => {
  it('maps the loading boolean', () => {
    const props: StateProps = mapStateToProps({ loading: true });
    expect(props.loading).toEqual(true);
  });
});
