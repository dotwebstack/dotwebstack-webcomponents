import { mount } from 'enzyme';
import React from 'react';
import fetchMock = require('fetch-mock');
import SearchInputWithSuggestions from '../../components/SearchInputWithSuggestions';

describe('<SearchInputWithSuggestions />', () => {

  jest.mock('react-dom');

  afterEach(fetchMock.reset);

  it('Sets value of input based on state', () => {
    const wrapper = mount(
            <SearchInputWithSuggestions onInputChange={(value: string) => (value) } endpoint={'endpoint'} />,
        );
    wrapper.find('input').simulate('change', { target: { value: 'testinput' } });
    expect(wrapper.find({ value:'testinput' }).length).toBeGreaterThan(0);
  });

  it('Executes onInputChange on submit', () => {
    const handleChange = jest.fn();
    const wrapper = mount(
            <SearchInputWithSuggestions onInputChange={handleChange} endpoint={'endpoint'}/>,
        );
    expect(handleChange).not.toHaveBeenCalled();
    wrapper.find('button').simulate('submit');
    expect(handleChange).toHaveBeenCalled();
  });

  it('fetches suggestions from specified endpoint and renders them correctly', (done) => {
    const endpoint = 'http://search.com/';
    const zoekTerm = 'testinput';

    fetchMock.mock('http://search.com/?zoekTerm=testinput', JSON.stringify(
        { _embedded: { suggesties: ['test', 'input'] } }));

    const wrapper = mount(
        <SearchInputWithSuggestions onInputChange={jest.fn() } endpoint={endpoint} searchDelay={10} />,
    );

    wrapper.find('input').simulate('change', { target: { value: zoekTerm } });

    expect(wrapper.find('.loading-suggestions')).toBeDefined();
    expect(wrapper.find('.loading-suggestions > em').text()).toBe('Loading suggestions...');

    /* delay required to load the suggestions */
    setTimeout(() => {
      wrapper.update();
      expect(fetchMock.calls().length).toBe(1);
      expect(wrapper.find('.suggestions > li').length).toBe(2);
      expect(wrapper.find('.suggestion-active')).toBeDefined();
      expect(wrapper.find('.suggestion-active').text()).toBe('test');

      done();
    },         20);
  });

  it('displays no suggestions found when fetching suggestions results in an error', (done) => {
    const endpoint = 'http://search.com/';
    const zoekTerm = 'testinput';

    fetchMock.mock('http://search.com/?zoekTerm=testinput', () => {
      throw new Error('error');
    });

    const wrapper = mount(
        <SearchInputWithSuggestions onInputChange={jest.fn() } endpoint={endpoint} searchDelay={10} />,
    );

    wrapper.find('input').simulate('change', { target: { value: zoekTerm } });

    /* delay required to load the suggestions */
    setTimeout(() => {
      wrapper.update();
      expect(fetchMock.calls().length).toBe(1);
      expect(wrapper.find('no-suggestions')).toBeDefined();

      done();
    },         20);
  });

  it('does not fetch suggestions when length of input is smaller than 3', () => {
    const wrapper = mount(
        <SearchInputWithSuggestions onInputChange={jest.fn() } endpoint={'endpoint'} searchDelay={10} />,
    );

    wrapper.find('input').simulate('change', { target: { value: 'te' } });

    expect(fetchMock.calls().length).toBe(0);
  });

  it('should display a message when no suggestions are found', (done) => {
    const endpoint = 'http://search.com/';

    fetchMock.mock('http://search.com/?zoekTerm=testinput', JSON.stringify(
        { _embedded: { suggesties: [] } }));

    const wrapper = mount(
        <SearchInputWithSuggestions onInputChange={jest.fn() } endpoint={endpoint} searchDelay={10} />,
    );

    wrapper.find('input').simulate('change', { target: { value: 'testinput' } });

    /* delay required to load the suggestions */
    setTimeout(() => {
      wrapper.update();
      expect(fetchMock.calls().length).toBe(1);
      expect(wrapper.find('.no-suggestions')).toBeDefined();
      expect(wrapper.find('.no-suggestions > em').text()).toBe('No suggestions found.');

      done();
    },         20);
  });

  it('should select suggestion when user selects it with a mouse click', (done) => {
    const endpoint = 'http://search.com/';

    fetchMock.mock('http://search.com/?zoekTerm=test', JSON.stringify(
        { _embedded: { suggesties: ['TestSuggestion'] } }));

    const wrapper = mount(
        <SearchInputWithSuggestions onInputChange={jest.fn()} endpoint={endpoint} searchDelay={5}/>,
    );

    wrapper.find('input').simulate('change', { target: { value: 'test' } });

    setTimeout(() => {
      wrapper.update();

      wrapper.find('li[className="suggestion-active"]').simulate('click',
                                                                 { currentTarget: { innerText: 'TestSuggestion' } });

      expect(wrapper.state('currentValue')).toBe('TestSuggestion');
      done();

    },         10);

  });

  it('checks if value is submitted when ', () => {
    const handleInputChange = jest.fn();
    const wrapper = mount(
            <SearchInputWithSuggestions onInputChange={handleInputChange} endpoint={'endpoint'} />,
        );
    expect(handleInputChange).not.toHaveBeenCalled();
    wrapper.find('input').simulate('change', { target: { value: 'testinput' } });
    expect(handleInputChange).not.toHaveBeenCalled();
    wrapper.find('form').simulate('submit');
    expect(handleInputChange).toHaveBeenCalledWith('testinput');
  });
});
