import React from 'react';
import LoadingIndicator from './LoadingIndicator';
import { Term } from 'rdf-js';

type Props = {
  src: string ,
  children: (tupleResult: TupleResult<BindingSet>) => JSX.Element,
};

type State = {
  tupleResult: TupleResult<BindingSet>,
  loading: boolean,
};

type BindingSet = {
  [name: string]: Term;
};

type SparqlResponse = {
  head: { vars: String[] },
  results: { bindings: {[key: string]: Term}[]},
};

class TupleResult<BindingSet> extends Set<BindingSet> {

  constructor(bindingSet: BindingSet[]) {
    super(bindingSet);
  }

  getBindingNames() {
    return this.values();
  }
}

class TupleContext extends React.Component<Props, State> {
  state = {
    tupleResult: new TupleResult([]),
    loading: true,
  };

  getBindingSet(response: SparqlResponse): BindingSet[] {
    return response.results.bindings.map((row) => {
      const bindingSet: BindingSet = {};
      Object.keys(row).forEach((key) => {
        bindingSet[key] = row[key];
      });
      return bindingSet;
    });
  }

  async componentDidMount() {
    fetch(this.props.src, { headers: { Accept: 'application/sparql-results+json' } })
    .then(response => response.json())
    .then((data) => {
      const bindingSets = this.getBindingSet(data as SparqlResponse);
      this.setState({
        tupleResult: new TupleResult(bindingSets),
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
