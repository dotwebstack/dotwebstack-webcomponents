import * as React from 'react';
import { connect } from 'react-redux';
import GraphState from '../graph/GraphState';
import DataFactory from '../DataFactory';
import Quad from '../Quad';

const dataFactory = new DataFactory();

export interface StateProps {
  propertyQuads: Quad[];
}

export interface OwnProps {
  resource: string;
}

export interface Props extends StateProps, OwnProps {}

const PropertyTable: React.StatelessComponent<Props> = ({ resource, propertyQuads }) => (
  <section>
    <h3>Resource: {resource}</h3>
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
  propertyQuads: state.quads.filter(quad => quad.subject.equals(
    dataFactory.namedNode(ownProps.resource),
  )),
});

export default connect<StateProps>(mapStateToProps)(PropertyTable);
