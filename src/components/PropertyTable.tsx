import * as React from 'react';
import { connect } from 'react-redux';
import GraphState from '../graph/GraphState';
import Quad from '../Quad';
import DataFactory from '../DataFactory';
import { NamedNode, BlankNode, DefaultGraph } from '../term';
import { findSingleStatement } from '../graph/utils';

const dataFactory = new DataFactory();

export interface StateProps {
  propertyQuads: Quad[];
}

export interface OwnProps {
  resource: NamedNode | BlankNode;
  graph?: NamedNode | BlankNode | DefaultGraph;
  namespaces?: string[];
  headingType?: string;
}

export interface Props extends StateProps, OwnProps {}

const PropertyTable: React.StatelessComponent<Props> = (props) => {
  const { resource, propertyQuads, headingType } = props;

  const labelStatement = findSingleStatement(
    propertyQuads,
    resource,
    dataFactory.namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
  );

  return (
    <section>
      {labelStatement && (
        React.createElement(headingType!, null, labelStatement.object.value)
      )}
      <table className="table">
        <thead>
          <tr>
            <th>Predicate</th>
            <th>Object</th>
          </tr>
        </thead>
        <tbody>
          {propertyQuads.map(quad => (
            <tr key={quad.predicate.value.concat(quad.object.value)}>
              <td>{quad.predicate.value}</td>
              <td>{quad.object.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

PropertyTable.defaultProps = {
  headingType: 'h1',
};

const mapStateToProps = (state: GraphState, ownProps: OwnProps): StateProps => ({
  propertyQuads: state.quads
    .filter(quad =>
      quad.subject.equals(ownProps.resource) &&
      quad.graph.equals(ownProps.graph!) &&
      (ownProps.namespaces ? ownProps.namespaces.reduce(
        (acc, namespace) => acc || quad.predicate.value.startsWith(namespace),
        false) :
      true),
    ),
});

const ConnectedPropertyTable = connect<StateProps>(mapStateToProps)(PropertyTable);

ConnectedPropertyTable.defaultProps = {
  graph: dataFactory.defaultGraph(),
};

export default ConnectedPropertyTable;
