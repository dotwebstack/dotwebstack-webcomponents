import { mount } from 'enzyme';
import React from 'react';
import SearchInput from '../../components/SearchInput';
import fetchMock = require('fetch-mock');

describe('<SearchInput />', () => {

  afterEach(() => {
    fetchMock.reset();
  });

  it('Sets value of input based on state', () => {
    const wrapper = mount(
      <SearchInput onInputChange={(value: string) => (value) } />,
      );
    wrapper.find('input').simulate('change', { target: { value: 'testinput' } });
    expect(wrapper.find({ value:'testinput' }).length).toBeGreaterThan(0);
  });

  it('Executes onInputChange on submit', () => {
    const handleChange = jest.fn();
    const wrapper = mount(
      <SearchInput onInputChange={handleChange} />,
      );
    expect(handleChange).not.toHaveBeenCalled();
    wrapper.find('button').simulate('submit');
    expect(handleChange).toHaveBeenCalled();
  });

  it('checks if value is submitted when ', () => {
    const handleInputChange = jest.fn();
    const wrapper = mount(
      <SearchInput onInputChange={handleInputChange} />,
    );
    expect(handleInputChange).not.toHaveBeenCalled();
    wrapper.find('input').simulate('change', { target: { value: 'testinput' } });
    expect(handleInputChange).not.toHaveBeenCalled();
    wrapper.find('form').simulate('submit');
    expect(handleInputChange).toHaveBeenCalledWith('testinput');
  });

  it('fetches suggestions from specified endpoint and renders them correctly', (done) => {
    const endpoint = 'http://search.com/';
    const zoekTerm = 'testinput';

    fetchMock.mock('http://search.com/?zoekTerm=testinput', JSON.stringify(
        { _embedded: { suggesties: ['test', 'input'] } }));

    const wrapper = mount(
        <SearchInput onInputChange={jest.fn() } suggest={{ endpoint, delay: 10 }} />,
    );

    wrapper.find('input').simulate('change', { target: { value: zoekTerm } });

    expect(wrapper.find('#loading-suggestions')).toBeDefined();
    expect(wrapper.find('#loading-suggestions > em').text()).toBe('Loading suggestions...');

    /* delay required to load the suggestions */
    setTimeout(() => {
      wrapper.update();
      expect(fetchMock.calls().length).toBe(1);

      const listItems = wrapper.find('li');
      expect(listItems.length).toBe(2);
      expect(listItems.at(0)).toBeDefined();
      expect(listItems.at(0).text()).toBe('test');

      done();
    },         20);
  });

  fit('uses suggestions from TupleResult', () => {
    const zoekTerm = 'test';
    const tupleResult = {
      getBindingSets: () => {
        return [
          {
            label: {
              value: 'Test',
            },
          },
          {
            label: {
              value: 'Other',
            },
          },
        ];
      },
    };

    const wrapper = mount(
        // @ts-ignore
        <SearchInput onInputChange={jest.fn} suggest={{ suggestions: [tupleResult, 'label'] }}/>,
    );

    wrapper.find('input').simulate('change', { target: { value: zoekTerm } });

    setImmediate(() => {
      wrapper.update();

      const listItems = wrapper.find('li');
      expect(listItems.length).toBe(1);
      expect(listItems.at(0)).toBeDefined();
      expect(listItems.at(0).text()).toBe('Test');
    });
  });

  it('displays no suggestions found when fetching suggestions results in an error', (done) => {
    const endpoint = 'http://search.com/';
    const zoekTerm = 'testinput';

    fetchMock.mock('http://search.com/?zoekTerm=testinput', () => {
      throw new Error('error');
    });

    const wrapper = mount(
        <SearchInput onInputChange={jest.fn() } suggest={{ endpoint, delay: 10 }} />,
    );

    wrapper.find('input').simulate('change', { target: { value: zoekTerm } });

    /* delay required to load the suggestions */
    setTimeout(() => {
      wrapper.update();
      expect(fetchMock.calls().length).toBe(1);
      expect(wrapper.find('#no-suggestions')).toBeDefined();

      done();
    },         20);
  });

  it('does not fetch suggestions when length of input is smaller than 3', () => {
    const wrapper = mount(
        <SearchInput onInputChange={jest.fn() } suggest={{ endpoint: 'endpoint', delay: 5 }} />,
    );

    wrapper.find('input').simulate('change', { target: { value: 'te' } });

    expect(fetchMock.calls().length).toBe(0);
  });

  it('should display a message when no suggestions are found', (done) => {
    const endpoint = 'http://search.com/';

    fetchMock.mock('http://search.com/?zoekTerm=testinput', JSON.stringify(
        { _embedded: { suggesties: [] } }));

    const wrapper = mount(
        <SearchInput onInputChange={jest.fn() } suggest={{ endpoint, delay: 10 }} />,
    );

    wrapper.find('input').simulate('change', { target: { value: 'testinput' } });

    /* delay required to load the suggestions */
    setTimeout(() => {
      wrapper.update();
      expect(fetchMock.calls().length).toBe(1);
      expect(wrapper.find('#no-suggestions')).toBeDefined();
      expect(wrapper.find('#no-suggestions > em').text()).toBe('No suggestions found.');

      done();
    },         20);
  });

  it('should select suggestion when user selects it with a mouse click', (done) => {
    const endpoint = 'http://search.com/';

    fetchMock.mock('http://search.com/?zoekTerm=test', JSON.stringify(
        { _embedded: { suggesties: ['TestSuggestion'] } }));

    const wrapper = mount(
        <SearchInput onInputChange={jest.fn()} suggest={{ endpoint, delay: 5 }}/>,
    );

    wrapper.find('input').simulate('change', { target: { value: 'test' } });

    setTimeout(() => {
      wrapper.update();

      wrapper.find('li').at(0).simulate('click',
                                        { currentTarget: { innerText: 'TestSuggestion' } });

      expect(wrapper.state('currentValue')).toBe('TestSuggestion');
      done();

    },         10);

  });
});
