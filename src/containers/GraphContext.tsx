import React from 'react';
import { NamedNode } from 'rdf-js';
import QuadLoader from '../lib/QuadLoader';
import Store from '../lib/Store';
import LoadingIndicator from '../components/LoadingIndicator';

export type GraphContextProps = {
  store: Store,
};

type Props = {
  src: NamedNode | NamedNode[],
  children: any,
};

type State = {
  store: Store,
  loading: boolean,
};

const defaultValue = {
  store: new Store([]),
};

const GraphContext = React.createContext<GraphContextProps>(defaultValue);

export class GraphProvider extends React.Component<Props, State> {
  state = {
    store: new Store([]),
    loading: true,
  };

  async componentDidMount() {
    const quadLoader = new QuadLoader();

    const urls: string[] = ([] as NamedNode[])
      .concat(this.props.src)
      .map(s => s.value.replace(/^http:\/\//, 'https://'));

    await Promise.all(urls.map(quadLoader.loadFromUrl))
      .then(result => result.reduce((acc, quads) => [...acc, ...quads]))
      .then(quads => this.setState({
        store: new Store(quads),
        loading: false,
      }));
  }

  render() {
    if (this.state.loading) {
      return (
        <LoadingIndicator />
      );
    }

    return (
      <GraphContext.Provider value={{ store: this.state.store }}>
        {this.props.children}
      </GraphContext.Provider>
    );
  }
}

export const GraphConsumer = GraphContext.Consumer;
