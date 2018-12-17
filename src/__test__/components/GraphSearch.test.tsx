import { shallow } from 'enzyme';
import React from 'react';
import GraphSearch from '../../components/GraphSearch';
import i18next from '../../i18n';
import Store from '../../lib/Store';

describe('<GraphSearch />', () => {

  const graphEndpoint = 'http://test.org';

  it('renders only searchfield and button when no defaultValue set', () => {
    const mockComponent: JSX.Element =  <div>test</div>;
    const wrapper = shallow(
      <GraphSearch endpoint={graphEndpoint} queryParam="subject">
        {() => (
          mockComponent
        )}
    </GraphSearch>);
    expect(wrapper.html()).not.toContain('test');
  });

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
      defaultValue: 'subject',
    };
    const component = new GraphSearch(props);
    expect(component.buildUrl()).toEqual('http://test.org?subject=subject');
  });

  it('builds correct query url with no queryParam', () => {
    const props = {
      endpoint: graphEndpoint,
      children: (store: Store) => <div>{store}</div>,
    };
    const component = new GraphSearch(props);
    expect(component.buildUrl()).toEqual('http://test.org?q=');
  });

  it('sets query param correctly', () => {
    const props = {
      endpoint: graphEndpoint,
      queryParam: 'subject',
      children: (store: Store) => <div>{store}</div>,
    };
    const component = new GraphSearch(props);
    expect(component.buildUrl()).toEqual('http://test.org?subject=');
  });
});
