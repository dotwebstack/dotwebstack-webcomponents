import React from 'react';
import { render } from 'react-dom';
import Label from '../containers/Label';
import DataFactory from '../DataFactory';
import renderComponent from '../renderComponent';
import { GraphContext } from '..';

const dataFactory = new DataFactory();

jest.mock('react-dom');

afterEach(jest.resetAllMocks);

describe('renderComponent', () => {
  it('renders component when found', () => {
    const resource = dataFactory.namedNode('http://foo');
    const config = {
      name: 'Label',
      props: { resource },
    };

    const div = document.createElement('div');
    renderComponent(config, div);
    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledWith(<Label resource={resource} />, div);
  });

  it('renders component with child components', () => {
    const resource = dataFactory.namedNode('http://foo');
    const config = {
      name: 'GraphContext',
      props: { src: resource },
      children: [
        {
          name: 'Label',
          props: { resource },
        },
      ],
    };

    const div = document.createElement('div');
    renderComponent(config, div);
    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledWith(
      <GraphContext src={resource}>
        <Label resource={resource} />
      </GraphContext>, div);
  });

  it('throws error when component not found', () => {
    const config = {
      name: 'Foo',
    };

    const div = document.createElement('div');
    expect(() => renderComponent(config, div)).toThrowError();
  });
});
