import * as React from 'react';
import { connect } from 'react-redux';
import GraphState from '../graph/GraphState';
import Quad from '../Quad';
import { NamedNode, BlankNode } from '../term';

export interface StateProps {
  propertyQuads: Quad[];
}

export interface OwnProps {
  resource: NamedNode | BlankNode;
}

export interface Props extends StateProps, OwnProps {}

const PropertyTable: React.StatelessComponent<Props> = ({ resource, propertyQuads }) => (
  <section>
    <h3>Resource: {resource.value}</h3>
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

const mapStateToProps = (state: GraphState, ownProps: OwnProps): StateProps => ({
  propertyQuads: state.quads.filter(quad => quad.subject.equals(ownProps.resource)),
});

export default connect<StateProps>(mapStateToProps)(PropertyTable);
