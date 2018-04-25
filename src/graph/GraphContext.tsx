import * as React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from './reducer';

interface Props {
  readonly children: any;
}

const GraphContext: React.StatelessComponent<Props> = props => {
  const middlewares = [
    thunkMiddleware,
  ];

  if (process.env.NODE_ENV === 'development') {
    const { logger } = require('redux-logger');
    middlewares.push(logger);
  };

  const store = createStore(reducer, applyMiddleware(...middlewares));

  return (
    <Provider store={store}>
      <div>
        {props.children}
      </div>
    </Provider>
  );
};

export default GraphContext;
