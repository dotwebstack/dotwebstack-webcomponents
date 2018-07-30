import React from 'react';
import { NamedNode, Quad } from 'rdf-js';
import JsonLdParser from 'rdf-parser-jsonld';
import QuadCollector from '../stream/QuadCollector';
import ResponseReader from '../stream/ResponseReader';

type Props = {
  src: NamedNode | NamedNode[],
  children: any,
};

type State = {
  quads: Quad[],
};

class GraphContext extends React.Component<Props, State> {
  state = {
    quads: [],
  };

  async componentDidMount() {
    const urls: string[] = ([] as NamedNode[])
      .concat(this.props.src)
      .map(s => s.value.replace(/^http:\/\//, 'https://'));

    const parser = new JsonLdParser();

    const fetchOpts = {
      headers: {
        Accept: 'application/ld+json',
      },
    };

    await Promise.all(urls.map(async (url) => {
      const response = await fetch(url, fetchOpts);

      if (!response.ok) {
        throw new Error('Failed reading data from URL.');
      }

      parser
        .import(new ResponseReader(response))
        .pipe(new QuadCollector(quads => this.setState({ quads })));
    }));
  }

  render() {
    return (
      <p>{this.state.quads.length}</p>
    );
  }
}

export default GraphContext;
