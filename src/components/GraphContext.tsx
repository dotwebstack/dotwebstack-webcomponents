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

async function retrieveStore(urls: string[], quadLoader: QuadLoader): Promise<Store> {
  return Promise.all(urls.map(quadLoader.loadFromUrl))
    .then(result => result.reduce((acc, quads) => [...acc, ...quads]))
    .then(quads => new Store(quads));
}

class GraphContext extends React.Component<Props, State> {
  state = {
    store: new Store([]),
    loading: true,
  };

  async componentDidMount() {
    await this.fetchData();
  }

  private async fetchData() {
    const quadLoader = new QuadLoader();
    const urls = ([] as string[]).concat(this.props.src);
    await retrieveStore(urls, quadLoader)
      .then(store => this.setState({
        store,
        loading: false,
      }));
  }

  async componentWillReceiveProps(nextProps: Props) {
    if (nextProps.src !== this.props.src) {
      await this.fetchData();
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <LoadingIndicator />
      );
    }
            // tslint:disable-next-line:no-console
    console.log(this.state.store);

    return this.props.children(this.state.store);
  }
}

export const graphContext = async (endpoint: string): Promise<Store> => {
  return retrieveStore([endpoint], new QuadLoader());
};

export default GraphContext;
