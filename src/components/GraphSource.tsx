import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import GraphState from '../graph/GraphState';
import { loadRdf } from '../graph/actions';
import { NamedNode, BlankNode, DefaultGraph } from '../term';

export interface DispatchProps {
  loadRdf: (url: string, graph?: NamedNode | BlankNode | DefaultGraph) => Promise<void>;
}

export interface StateProps {}

export interface OwnProps {
  graph?: NamedNode | BlankNode | DefaultGraph;
}

export interface Props extends DispatchProps, StateProps, OwnProps {
  url: string;
}

class GraphSource extends React.Component<Props> {
  componentDidMount() {
    const { url, graph } = this.props;
    this.props.loadRdf(url, graph);
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state: GraphState): StateProps => ({});

const mapDispatchToProps = (dispatch: Dispatch<GraphState>): DispatchProps => ({
  loadRdf: (url: string, graph?: NamedNode | BlankNode | DefaultGraph) =>
    dispatch(loadRdf(url, graph)),
});

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(GraphSource);
