import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import i18next from '../../i18n';
import TupleSearch from '../../components/TupleSearch';
import { TupleContext, TupleResult } from '../..';
import fetchMock from 'fetch-mock';
import { mockResponse } from '../TestData';

describe('<TupleSearch />', () => {

  const tupleEndpoint = 'http://test.org';

  type MockComponentProps = {
    result: TupleResult;
  };

  const endpoint = 'https://example.org/search';
  const Result: React.StatelessComponent<MockComponentProps> = () => <p>Result</p>;
  const searchResult = (result: TupleResult) => <Result result={result} />;

  const createWrapper = () => {
    return mount((
      <TupleSearch endpoint={endpoint}>
        {searchResult}
      </TupleSearch>));
  };

  const hasContext = (wrapper: ReactWrapper, endpoint: string) => {
    return wrapper.contains((
      <TupleContext src={endpoint}>
        {searchResult}
      </TupleContext>
    ));
  };

  fetchMock.mock(endpoint, mockResponse);
  fetchMock.mock(endpoint + '?q=foo', mockResponse);
  fetchMock.mock(endpoint + '?q=', mockResponse);

  it('renders the given component with the context result as argument', () => {
    const wrapper: ReactWrapper = createWrapper();

    wrapper.find('form input').simulate('change', { target: { value: 'foo' } });
    wrapper.find('form').simulate('submit');

    expect(hasContext(wrapper, `${endpoint}?q=foo`)).toBe(true);
  });

  it('renders only search form when no submit event', () => {
    const wrapper: ReactWrapper = createWrapper();

    wrapper.find('form input').simulate('change', { target: { value: 'foo' } });

    expect(hasContext(wrapper, `${endpoint}?q=foo`)).toBe(false);
  });

  it('renders context only when submit event fired', () => {
    const wrapper: ReactWrapper = createWrapper();

    wrapper.find('form').simulate('submit');

    expect(hasContext(wrapper, `${endpoint}?q=`)).toBe(true);

    wrapper.find('form input').simulate('change', { target: { value: 'foo' } });

    expect(hasContext(wrapper, `${endpoint}?q=foo`)).toBe(false);

    wrapper.find('form').simulate('submit');

    expect(hasContext(wrapper, `${endpoint}?q=foo`)).toBe(true);
  });

  it('shows loading indicator directly after submit event', () => {
    const wrapper: ReactWrapper = createWrapper();

    wrapper.find('form input').simulate('change', { target: { value: 'foo' } });
    wrapper.find('form').simulate('submit');

    expect(wrapper.html()).toMatch(i18next.t('loadData'));
  });

  it('builds correct query url', () => {
    const props = {
      endpoint: tupleEndpoint,
      queryParam: 'subject',
      children: jest.fn((result: TupleResult) => { return result; }),
      defaultValue: 'subject',
    };
    const component = new TupleSearch(props);
    expect(component.buildUrl()).toEqual('http://test.org?subject=subject');
  });

  it('builds correct query url with no queryParam', () => {
    const props = {
      endpoint: tupleEndpoint,
      children: (result: TupleResult) => <div>{result}</div>,
    };
    const component = new TupleSearch(props);
    expect(component.buildUrl()).toEqual('http://test.org?q=');
  });

  it('sets query param correctly', () => {
    const props = {
      endpoint: tupleEndpoint,
      queryParam: 'subject',
      children: (result: TupleResult) => <div>{result}</div>,
    };
    const component = new TupleSearch(props);
    expect(component.buildUrl()).toEqual('http://test.org?subject=');
  });
});
