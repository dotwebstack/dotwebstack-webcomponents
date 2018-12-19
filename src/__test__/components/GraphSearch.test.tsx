import React from 'react';
import { mount } from 'enzyme';
import { GraphSearch, Store, GraphContext } from '../..';

describe('<GraphSearch />', () => {
  type MockComponentProps = {
    store: Store;
  };

  it('renders the given component with the context store as argument', () => {
    const endpoint = 'https://example.org/search';
    const Result: React.StatelessComponent<MockComponentProps> = () => <p>Result</p>;
    const searchResult = (store: Store) => <Result store={store} />;

    const wrapper = mount((
      <GraphSearch endpoint={endpoint}>
        {searchResult}
      </GraphSearch>
    ));

    wrapper.find('form input').simulate('change', { target: { value: 'foo' } });
    wrapper.find('form').simulate('submit');

    expect(wrapper.contains((
      <GraphContext src={`${endpoint}?q=foo`}>
        {searchResult}
      </GraphContext>
    ))).toBe(true);
  });
});
