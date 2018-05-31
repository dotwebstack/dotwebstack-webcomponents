import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { ContextWrapper } from './ContextWrapper';
import { loadTuples } from '../actions';
import { TupleState } from '../model';
import tupleReducer from '../tupleReducer';

export interface Props {
  readonly src: string;
  readonly children: any;
}

class TupleContext extends React.Component<Props> {
  store: Store<TupleState>;

  constructor(props: Props) {
    super(props);

    const middlewares = [
      thunkMiddleware,
    ];

    if (process.env.NODE_ENV === 'development') {
      const { logger } = require('redux-logger');
      middlewares.push(logger);
    }

    this.store = createStore<TupleState>(tupleReducer, applyMiddleware(...middlewares));
  }

  componentDidMount() {
    this.store.dispatch(loadTuples(this.props.src));
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

export default TupleContext;
