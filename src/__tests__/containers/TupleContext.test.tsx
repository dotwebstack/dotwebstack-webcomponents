import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import TupleContext from '../../containers/TupleContext';

describe('TupleContext', () => {
  it('calls componentDidMount() lifecycle method', () => {
    const spy = sinon.spy(TupleContext.prototype, 'componentDidMount');
    mount(<TupleContext src={'http://foo'}><div>sdf</div></TupleContext>);
    expect(spy.calledOnce).toBe(true);
  });
});
