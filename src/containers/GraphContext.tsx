import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';
import ContextWrapper from './ContextWrapper';
import { loadRdf } from '../actions';
import { GraphState, NamedNode } from '../model';
import graphReducer from '../graphReducer';

export interface Props {
  readonly src: NamedNode | NamedNode[];
  readonly children: any;
}

class GraphContext extends React.Component<Props> {
  store: Store<GraphState>;

  constructor(props: Props) {
    super(props);

    const middlewares = [
      thunkMiddleware,
    ];

    if (process.env.NODE_ENV === 'development') {
      const { logger } = require('redux-logger');
      middlewares.push(logger);
    }

    this.store = createStore<GraphState>(graphReducer, applyMiddleware(...middlewares));
  }

  componentDidMount() {
    this.store.dispatch(loadRdf(this.props.src));
  }

  render() {
    return (
      <Provider store={this.store}>
        <ContextWrapper>
          {this.props.children}
        </ContextWrapper>
      </Provider>
    );
  }
}

export default GraphContext;
