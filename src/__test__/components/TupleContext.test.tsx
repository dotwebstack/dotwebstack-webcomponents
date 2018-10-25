import { shallow } from 'enzyme';
import React from 'react';
import TupleContext from '../../components/TupleContext';
import i18next from '../../i18n';
import fetchMock = require('fetch-mock');
import { mockResponse } from '../TestData';

describe('<TupleContext />', () => {

  fetchMock.mock('http://example.org', mockResponse);

  it('shows loading indicator', () => {
    const wrapper = shallow(<TupleContext src={'http://example.org'}>
    {store => (
          <React.Component store={store} />
        )}
    </TupleContext>);
    wrapper.setState({ loading: true });
    expect(wrapper.html()).toMatch(i18next.t('loadData'));
  });
});
