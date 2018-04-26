import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import GraphState from './GraphState';
import { loadRdf } from './actions';

export interface DispatchProps {
  loadRdf: (url: string) => Promise<void>,
};

export interface StateProps {};

export interface Props extends DispatchProps, StateProps {
  url: string;
}

class GraphSource extends React.Component<Props> {
  componentDidMount() {
    this.props.loadRdf(this.props.url);
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state: GraphState): StateProps => ({});

const mapDispatchToProps = (dispatch: Dispatch<GraphState>): DispatchProps => ({
  loadRdf: (url: string) => dispatch(loadRdf(url)),
});

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(GraphSource);
