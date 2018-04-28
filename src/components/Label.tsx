import * as React from 'react';
import { connect } from 'react-redux';
import GraphState from '../graph/GraphState';
import DataFactory from '../DataFactory';
import { NamedNode, BlankNode, DefaultGraph } from '../term';
import { findSingleStatement } from '../graph/utils';

const dataFactory = new DataFactory();

export interface StateProps {
  label: string;
}

export interface OwnProps {
  resource: NamedNode | BlankNode;
  graph?: NamedNode | BlankNode | DefaultGraph;
}

export interface Props extends StateProps, OwnProps {}

const Label: React.StatelessComponent<Props> = ({ label }) => (
  <React.Fragment>{label}</React.Fragment>
);

const mapStateToProps = (state: GraphState, ownProps: OwnProps): StateProps => {
  const quads = state.quads.filter(quad =>
    quad.subject.equals(ownProps.resource) &&
    quad.graph.equals(ownProps.graph!));

  const labelStatement = findSingleStatement(
    quads,
    ownProps.resource,
    dataFactory.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
  );

  const label = labelStatement ? labelStatement.object.value : ownProps.resource.value;

  return {
    label,
  };
};

const ConnectedLabel = connect<StateProps>(mapStateToProps)(Label);

ConnectedLabel.defaultProps = {
  graph: dataFactory.defaultGraph(),
};

export default ConnectedLabel;
