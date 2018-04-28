import * as React from 'react';
import { connect } from 'react-redux';
import GraphState from '../graph/GraphState';
import Quad from '../Quad';
import DataFactory from '../DataFactory';
import Label from './Label';
import { NamedNode, BlankNode, DefaultGraph } from '../term';

const dataFactory = new DataFactory();

export interface StateProps {
  resourceQuads: Quad[];
}

export interface OwnProps {
  resource: NamedNode | BlankNode;
  graph?: NamedNode | BlankNode | DefaultGraph;
  vocabularyGraph?: NamedNode | BlankNode | DefaultGraph;
  namespaces?: string[];
  headingType?: string;
}

export interface Props extends StateProps, OwnProps {}

const PropertyTable: React.StatelessComponent<Props> = (props) => {
  const { resource, graph, vocabularyGraph, resourceQuads, headingType } = props;

  return (
    <section>
      {React.createElement(headingType!, null, <Label resource={resource} graph={graph} />)}
      <table className="table">
        <thead>
          <tr>
            <th>Predicate</th>
            <th>Object</th>
          </tr>
        </thead>
        <tbody>
          {resourceQuads.map(quad => (
            <tr key={quad.predicate.value.concat(quad.object.value)}>
              <td>
                <Label resource={quad.predicate} graph={vocabularyGraph} />
              </td>
              <td>
                {quad.object instanceof NamedNode || quad.object instanceof BlankNode ? (
                  <a href={quad.object.value}>
                    <Label resource={quad.object} graph={vocabularyGraph} />
                  </a>
                ) : quad.object.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

const mapStateToProps = (state: GraphState, ownProps: OwnProps): StateProps => ({
  resourceQuads: state.quads.filter(quad =>
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
  vocabularyGraph: dataFactory.defaultGraph(),
  headingType: 'h1',
};

export default ConnectedPropertyTable;
