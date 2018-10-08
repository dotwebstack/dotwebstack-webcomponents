import React from 'react';
import QuadLoader from '../lib/QuadLoader';
import Store from '../lib/Store';
import LoadingIndicator from './LoadingIndicator';

type Props = {
  src: string | string[],
  children: (store: Store) => JSX.Element,
};

type State = {
  store: Store,
  loading: boolean,
};

class GraphContext extends React.Component<Props, State> {
  state = {
    store: new Store([]),
    loading: true,
  };

  async componentDidMount() {
    const quadLoader = new QuadLoader();
    const urls = ([] as string[]).concat(this.props.src);

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

    return this.props.children(this.state.store);
  }
}

export default GraphContext;
