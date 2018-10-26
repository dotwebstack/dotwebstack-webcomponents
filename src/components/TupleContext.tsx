import React from 'react';
import LoadingIndicator from './LoadingIndicator';
import { TupleResult, SparqlResponse } from '../lib/TupleResult';
import { fetchSparqlResult } from '../utils';
import log from 'loglevel';

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
    fetchSparqlResult(this.props.src)
      .then((data) => {
        this.setState({
          tupleResult: new TupleResult(data as SparqlResponse),
          loading: false,
        });
      }).catch((e) => {
        log.error(e);
        this.setState({
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

export const tupleContext = async (src: string): Promise<TupleResult> => {
  return fetchSparqlResult(src)
    .then((data) => {
      return new TupleResult(data as SparqlResponse);
    });
};

export default TupleContext;
