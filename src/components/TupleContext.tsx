import React from 'react';
import LoadingIndicator from './LoadingIndicator';
import { TupleResult, SparqlResponse } from '../lib/TupleResult';

type Props = {
  src: string ,
  children: (tupleResult: TupleResult) => JSX.Element,
};

type State = {
  tupleResult: TupleResult,
  loading: boolean,
};

class TupleContext extends React.Component<Props, State> {
  state = {
    tupleResult: new TupleResult(),
    loading: true,
  };

  async componentDidMount() {
    fetch(this.props.src, { headers: { Accept: 'application/sparql-results+json' } })
    .then(response => response.json())
    .then((data) => {
      this.setState({
        tupleResult: new TupleResult(data as SparqlResponse),
        loading: false,
      });
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <LoadingIndicator />
      );
    }

    return this.props.children(this.state.tupleResult);
  }
}

export default TupleContext;
