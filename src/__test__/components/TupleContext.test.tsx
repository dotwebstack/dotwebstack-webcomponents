import { shallow } from 'enzyme';
import React from 'react';
import TupleContext from '../../components/TupleContext';
import i18next from '../../i18n';

describe('<TupleContext />', () => {

  it('shows loading indicator', () => {
    const wrapper = shallow(<TupleContext src={'http://example.org'}>
    {tupleResult => (
          <React.Component tupleResult={tupleResult} />
        )}
    </TupleContext>);
    wrapper.setState({ loading: true });
    expect(wrapper.html()).toMatch(i18next.t('loadData'));
  });

  it('renders when no source provided', () => {
    shallow(<TupleContext src={''}>
    {tupleResult => (
          <React.Component tupleResult={tupleResult} />
        )}
    </TupleContext>);
  });
});
