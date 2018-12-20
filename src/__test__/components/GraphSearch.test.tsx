import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import i18next from '../../i18n';
import GraphSearch from '../../components/GraphSearch';
import { Store } from '../..';

describe('<GraphSearch />', () => {

  const graphEndpoint = 'http://test.org';

  type MockComponentProps = {
    result: Store;
  };

  const endpoint = 'https://example.org/search';
  const Result: React.StatelessComponent<MockComponentProps> = () => <p>Result</p>;
  const searchResult = (result: Store) => <Result result={result} />;

  const createWrapper = () => {
    return mount((
      <GraphSearch endpoint={endpoint}>
        {searchResult}
      </GraphSearch>));
  };

  jest.mock('../../components/GraphContext', () => 'GraphContext');


  it('renders the given component with the context result as argument', () => {
    const wrapper: ReactWrapper = createWrapper();

    wrapper.find('form input').simulate('change', { target: { value: 'foo' } });
    wrapper.find('form').simulate('submit');

    expect(wrapper.find('GraphContext').prop('src')).toEqual(`${endpoint}?q=foo`);
  });

  it('renders only search form when no submit event', () => {
    const wrapper: ReactWrapper = createWrapper();

    wrapper.find('form input').simulate('change', { target: { value: 'foo' } });

    expect(wrapper.find('GraphContext').length).toBe(0);
  });

  it('renders context only when submit event fired', () => {
    const wrapper: ReactWrapper = createWrapper();

    wrapper.find('form').simulate('submit');

    expect(wrapper.find('GraphContext').prop('src')).toEqual(`${endpoint}?q=`);

    wrapper.find('form input').simulate('change', { target: { value: 'foo' } });

    expect(wrapper.find('GraphContext').prop('src')).not.toEqual(`${endpoint}?q=foo`);

    wrapper.find('form').simulate('submit');

    expect(wrapper.find('GraphContext').prop('src')).toEqual(`${endpoint}?q=foo`);
  });

  it('shows loading indicator directly after submit event', () => {
    const wrapper: ReactWrapper = createWrapper();

    wrapper.find('form input').simulate('change', { target: { value: 'foo' } });
    wrapper.find('form').simulate('submit');

    expect(wrapper.html()).toMatch(i18next.t('loadData'));
  });

  it('builds correct query url', () => {
    const props = {
      endpoint: graphEndpoint,
      queryParam: 'subject',
      children: jest.fn((result: Store) => { return result; }),
      defaultValue: 'subject',
    };
    const component = new GraphSearch(props);
    expect(component.buildUrl()).toEqual('http://test.org?subject=subject');
  });

  it('builds correct query url with no queryParam', () => {
    const props = {
      endpoint: graphEndpoint,
      children: (result: Store) => <div>{result}</div>,
    };
    const component = new GraphSearch(props);
    expect(component.buildUrl()).toEqual('http://test.org?q=');
  });

  it('sets query param correctly', () => {
    const props = {
      endpoint: graphEndpoint,
      queryParam: 'subject',
      children: (result: Store) => <div>{result}</div>,
    };
    const component = new GraphSearch(props);
    expect(component.buildUrl()).toEqual('http://test.org?subject=');
  });
});
