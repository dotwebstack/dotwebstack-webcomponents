import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import GraphContext from '../../containers/GraphContext';
import DataFactory from '../../DataFactory';

const dataFactory = new DataFactory();

describe('GraphContext', () => {
  it('calls componentDidMount() lifecycle method', () => {
    const spy = sinon.spy(GraphContext.prototype, 'componentDidMount');
    const resource = dataFactory.namedNode('http://foo');
    mount(<GraphContext src={resource}><div /></GraphContext>);
    expect(spy.calledOnce).toEqual(true);
  });
});
