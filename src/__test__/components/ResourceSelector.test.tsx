import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import ResourceSelector from '../../components/ResourceSelector';
import { BindingSet } from '../../lib/TupleResult';
import fetchMock = require('fetch-mock');

describe('<ResourceSelector />', () => {

  const createLinkHref = (resource: string) => {
    const url = new URL(`https://example.org/waardelijst`);
    url.searchParams.set('uri', resource);
    return url.href;

  };

  const endpoint = 'https://example.org/versions';
  const createWrapper = (transform?: (bindingSets: BindingSet[]) => BindingSet[]) => {
    return mount(
      <ResourceSelector
        endpoint={endpoint}
        resourceParam="r"
        resource="ex:w2"
        resourceColumn="waardelijst"
        displayColumn="version"
        transformBindingSets={transform}
        createLinkHref={createLinkHref}/>
    );
  };

  const mockJson = JSON.stringify({
    head: { vars: [ 'waardelijst', 'version' ] },
    results: { bindings: [
      { waardelijst: { type: 'uri', value: 'ex:w1' }, version: { type: 'literal', value: '1.2.0-a' } },
      { waardelijst: { type: 'uri', value: 'ex:w2' }, version: { type: 'literal', value: '1.3.0-b' } }
    ] }
  });
  const expectedDataSourceUrl = `${endpoint}?r=` + encodeURIComponent('ex:w2');
  fetchMock.mock(expectedDataSourceUrl, mockJson);
  afterEach(fetchMock.resetHistory);

  it('renders the context with the correct data source url', () => {
    const wrapper: ReactWrapper = createWrapper();
    expect(wrapper.find('TupleContext').prop('src')).toEqual(expectedDataSourceUrl);
  });

  it('creates links corresponding to fetched results', done => {
    const wrapper: ReactWrapper = createWrapper();
    setTimeout(() => {
      wrapper.update();
      expect(fetchMock.calls().length).toBe(1);

      expect(wrapper.find('a')).toHaveLength(2);
      expect(wrapper.find('a').at(0).props()).toEqual(expect.objectContaining({
        href: 'https://example.org/waardelijst?uri=' + encodeURIComponent('ex:w1'),
        children: '1.2.0-a',
        className: 'btn btn-info',
      }));
      expect(wrapper.find('a').at(1).props()).toEqual(expect.objectContaining({
        href: 'https://example.org/waardelijst?uri=' + encodeURIComponent('ex:w2'),
        children: '1.3.0-b',
        className: 'btn btn-success',
      }));
      done();
    }, 50);
  });

  it('applies transform function', done => {
    const transform = (bindingSets: BindingSet[]) => {
      return bindingSets.filter(bindingSet => bindingSet.version.value === '1.3.0-b');
    };
    const wrapper: ReactWrapper = createWrapper(transform);
    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find('a')).toHaveLength(1);
      expect(wrapper.find('a').props()).toEqual(expect.objectContaining({
        href: 'https://example.org/waardelijst?uri=' + encodeURIComponent('ex:w2'),
        children: '1.3.0-b',
        className: 'btn btn-success',
      }));
      done();
    }, 50);
  });

});
