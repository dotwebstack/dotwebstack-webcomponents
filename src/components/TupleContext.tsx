import React from 'react';
import LoadingIndicator from './LoadingIndicator';
import { TupleResult, SparqlResponse } from '../lib/TupleResult';
import { fetchSparqlResult } from '../utils';
import log from 'loglevel';

type Props = {
  src: string ,
  children: (data: TupleResult) => JSX.Element,
};

type State = {
  data: TupleResult,
  loading: boolean,
  error: boolean,
};

class TupleContext extends React.Component<Props, State> {
  state = {
    data: new TupleResult(),
    loading: true,
    error: false,
  };

  async componentDidMount() {
    fetchSparqlResult(this.props.src)
      .then((data) => {
        this.setState({
          data: new TupleResult(data as SparqlResponse),
          loading: false,
        });
      }).catch((e) => {
        log.error(e);
        this.setState({
          loading: false,
          error: true,
        });
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <LoadingIndicator />
      );
    }
    if (this.state.error) {
      return ('An error has occured');
    }

    return this.props.children(this.state.data);
  }
}

export const tupleContext = async (src: string): Promise<TupleResult> => {
  return fetchSparqlResult(src)
  .then(data => new TupleResult(data as SparqlResponse));
};

export default TupleContext;
