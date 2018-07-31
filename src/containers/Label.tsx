import React from 'react';
import { Term } from 'rdf-js';

type Props = {
  resource: Term,
};

const Label: React.StatelessComponent<Props> = ({ resource }) => (
  <p>{resource.value}</p>
);

export default Label;

// import { connect } from 'react-redux';
// import DataFactory from '../DataFactory';
// import { NamedNode, BlankNode, DefaultGraph } from 'rdf-js';
// import { findSingleStatement } from '../utils';

// const dataFactory = new DataFactory();

// export interface StateProps {
//   readonly value: string;
// }

// export interface OwnProps {
//   readonly resource: NamedNode | BlankNode;
//   readonly graph?: NamedNode | BlankNode | DefaultGraph;
// }

// export interface Props extends StateProps, OwnProps {}

// export const Label: React.StatelessComponent<Props> = ({ value }) => (
//   <React.Fragment>{value}</React.Fragment>
// );

// export const mapStateToProps = (state: GraphState, ownProps: OwnProps): StateProps => {
//   const quads = state.quads.filter(quad =>
//     quad.subject.equals(ownProps.resource) &&
//     quad.graph.equals(ownProps.graph!));

//   const labelStatement = findSingleStatement(
//     quads,
//     ownProps.resource,
//     dataFactory.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
//   );

//   const label = labelStatement ? labelStatement.object.value : ownProps.resource.value;

//   return {
//     value: label,
//   };
// };

// const ConnectedLabel = connect(mapStateToProps)(Label);

// ConnectedLabel.defaultProps = {
//   graph: dataFactory.defaultGraph(),
// };

// export default ConnectedLabel;
