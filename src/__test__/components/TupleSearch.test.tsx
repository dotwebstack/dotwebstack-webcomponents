import { shallow } from 'enzyme';
import React from 'react';
import i18next from '../../i18n';
import TupleSearch from '../../components/TupleSearch';
import TupleResult from '../../lib/TupleResult';

describe('<TupleSearch />', () => {

  const tupleEndpoint = 'http://test.org';

  it('shows loading indicator', () => {
    const wrapper = shallow(
      <TupleSearch endpoint={tupleEndpoint} queryParam="subject">
      {store => (
        <React.Component>{store}</React.Component>
      )}
    </TupleSearch>);
    wrapper.setState({ query: 'test' });
    expect(wrapper.html()).toMatch(i18next.t('loadData'));
  });

  it('builds correct query url', () => {
    const props = {
      endpoint: tupleEndpoint,
      queryParam: 'subject',
      children: (store: TupleResult) => <div>{store}</div>,
      query: 'subject',
    };
    const component = new TupleSearch(props);
    expect(component.buildUrl()).toEqual('http://test.org?subject=subject');
  });
});
