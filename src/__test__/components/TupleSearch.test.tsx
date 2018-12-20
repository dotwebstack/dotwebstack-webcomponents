import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import i18next from '../../i18n';
import TupleSearch from '../../components/TupleSearch';
import { TupleResult } from '../..';

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

  jest.mock('../../components/TupleContext', () => 'TupleContext');

  it('renders the given component with the context result as argument', () => {
    const wrapper: ReactWrapper = createWrapper();

    wrapper.find('form input').simulate('change', { target: { value: 'foo' } });
    wrapper.find('form').simulate('submit');

    expect(wrapper.find('TupleContext').prop('src')).toEqual(`${endpoint}?q=foo`);
  });

  it('renders only search form when no submit event', () => {
    const wrapper: ReactWrapper = createWrapper();

    wrapper.find('form input').simulate('change', { target: { value: 'foo' } });

    expect(wrapper.find('TupleContext').length).toBe(0);
  });

  it('renders context only when submit event fired', () => {
    const wrapper: ReactWrapper = createWrapper();

    wrapper.find('form').simulate('submit');

    expect(wrapper.find('TupleContext').prop('src')).toEqual(`${endpoint}?q=`);

    wrapper.find('form input').simulate('change', { target: { value: 'foo' } });

    expect(wrapper.find('TupleContext').prop('src')).not.toEqual(`${endpoint}?q=foo`);

    wrapper.find('form').simulate('submit');

    expect(wrapper.find('TupleContext').prop('src')).toEqual(`${endpoint}?q=foo`);
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
