import React from 'react';
import { NamedNode, Quad } from 'rdf-js';
import QuadLoader from '../lib/QuadLoader';

export type GraphContextProps = {
  store: Quad[];
};

type Props = {
  src: NamedNode | NamedNode[],
  children: any,
};

type State = GraphContextProps;

const defaultValue = {
  store: [],
};

const GraphContext = React.createContext<GraphContextProps>(defaultValue);

export class GraphProvider extends React.Component<Props, State> {
  state = {
    store: [],
  };

  async componentDidMount() {
    const quadLoader = new QuadLoader();

    const urls: string[] = ([] as NamedNode[])
      .concat(this.props.src)
      .map(s => s.value.replace(/^http:\/\//, 'https://'));

    await Promise.all(urls.map(quadLoader.loadFromUrl))
      .then(result => result.reduce((acc, quads) => [...acc, ...quads]))
      .then(quads => this.setState({
        store: quads,
      }));
  }

  render() {
    return (
      <GraphContext.Provider value={this.state}>
        {this.props.children}
      </GraphContext.Provider>
    );
  }
}

export const GraphConsumer = GraphContext.Consumer;
