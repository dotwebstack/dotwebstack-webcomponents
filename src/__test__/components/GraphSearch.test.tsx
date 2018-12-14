import { shallow } from 'enzyme';
import React from 'react';
import i18next from '../../i18n';
import GraphSearch from '../../components/GraphSearch';
import Store from '../../lib/Store';

describe('<GraphSearch />', () => {

  const graphEndpoint = 'http://test.org';

  it('shows loading indicator', () => {
    const wrapper = shallow(
      <GraphSearch endpoint={graphEndpoint} queryParam="subject">
      {store => (
        <React.Component>{store}</React.Component>
      )}
    </GraphSearch>);
    wrapper.setState({ query: 'test' });
    expect(wrapper.html()).toMatch(i18next.t('loadData'));
  });

  it('builds correct query url', () => {
    const props = {
      endpoint: graphEndpoint,
      queryParam: 'subject',
      children: (store: Store) => <div>{store}</div>,
      query: 'subject',
    };
    const component = new GraphSearch(props);
    expect(component.buildUrl()).toEqual('http://test.org?subject=subject');
  });
});
