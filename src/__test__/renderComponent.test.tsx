import * as React from 'react';
import renderComponent from '../renderComponent';
import { render } from 'react-dom';
import { namedNode } from 'rdf-data-model';
import Store from '../lib/Store';
import Vocabulary from '../components/Vocabulary';

jest.mock('react-dom');

afterEach(jest.resetAllMocks);

describe('renderComponent', () => {
  it('renders component when found', () => {
    const ontology = namedNode('http://foo');
    const store = new Store([]);

    const config = {
      name: 'Vocabulary',
      props: { ontology, store },
    };

    const div = document.createElement('div');
    renderComponent(config, div);
    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledWith(<Vocabulary ontology={ontology} store={store} />, div);
  });

  it('throws error when component not found', () => {
    const config = {
      name: 'Foo',
    };

    const div = document.createElement('div');
    expect(() => renderComponent(config, div)).toThrowError();
  });
})
;
