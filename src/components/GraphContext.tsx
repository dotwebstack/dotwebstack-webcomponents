import * as React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';
import GraphContextWrapper from './GraphContextWrapper';
import { loadRdf } from '../graph/actions';
import { GraphState, GraphSource } from '../graph';
import reducer from '../graph/reducer';

export interface Props {
  readonly src: GraphSource[];
  readonly children: any;
}

class GraphContext extends React.Component<Props> {
  store: Store<GraphState | undefined>;

  constructor(props: Props) {
    super(props);

    const middlewares = [
      thunkMiddleware,
    ];

    if (process.env.NODE_ENV === 'development') {
      const { logger } = require('redux-logger');
      middlewares.push(logger);
    }

    this.store = createStore(reducer, applyMiddleware(...middlewares));
  }

  componentDidMount() {
    this.store.dispatch(loadRdf(this.props.src));
  }

  render() {
    return (
      <Provider store={this.store}>
        <GraphContextWrapper>
          {this.props.children}
        </GraphContextWrapper>
      </Provider>
    );
  }
}

export default GraphContext;
