import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import * as R from 'ramda';
import { GraphState } from '..';
import Quad from '../../Quad';
import DataFactory from '../../DataFactory';
import Label from './Label';
import { NamedNode, BlankNode, DefaultGraph } from '../../term';

const dataFactory = new DataFactory();

export interface StateProps {
  readonly resourceQuads: Quad[];
}

export interface OwnProps {
  readonly iri: NamedNode | BlankNode;
  readonly graph?: NamedNode | BlankNode | DefaultGraph;
  readonly vocabularyGraph?: NamedNode | BlankNode | DefaultGraph;
  readonly namespaces?: string[];
}

export interface Props extends StateProps, OwnProps {}

const Resource: React.StatelessComponent<Props> = (props) => {
  const { iri, graph, vocabularyGraph, resourceQuads } = props;

  return (
    <section>
      <Table>
        <thead>
          <tr>
            <th scope="col">Predicate</th>
            <th scope="col">Object</th>
          </tr>
        </thead>
        <tbody>
          {resourceQuads.map(quad => (
            <tr key={quad.predicate.value.concat(quad.object.value)}>
              <th scope="row">
                <a href={quad.predicate.value}>
                  <Label resource={quad.predicate} graph={vocabularyGraph} />
                </a>
              </th>
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
      </Table>
    </section>
  );
};

const mapStateToProps = (state: GraphState, ownProps: OwnProps): StateProps => ({
  resourceQuads: state.quads.filter(quad =>
    quad.subject.equals(ownProps.iri) &&
    quad.graph.equals(ownProps.graph!) &&
    (ownProps.namespaces ? ownProps.namespaces.reduce(
      (acc, namespace) => acc || R.startsWith(namespace, quad.predicate.value),
      false) :
    true),
  ),
});

const ConnectedResource = connect(mapStateToProps)(Resource);

ConnectedResource.defaultProps = {
  graph: dataFactory.defaultGraph(),
  vocabularyGraph: dataFactory.defaultGraph(),
};

export default ConnectedResource;
