import React from 'react';
import { connect } from 'react-redux';
import { TableProps } from 'reactstrap';
import { NamedNode, BlankNode, GraphState, Quad } from '../model';
import PropertyTable from '../components/PropertyTable';

export interface StateProps {
  readonly quads: Quad[];
}

export interface OwnProps {
  readonly iri: NamedNode | BlankNode;
  readonly tableProps?: TableProps;
}

export interface Props extends StateProps, OwnProps {}

const Resource: React.StatelessComponent<Props> = (props) => {
  const { quads, tableProps } = props;

  return (
    <PropertyTable
      quads={quads}
      tableProps={tableProps}
    />
  );
};

const mapStateToProps = (state: GraphState, ownProps: OwnProps): StateProps => ({
  quads: state.quads.filter(quad => quad.subject.equals(ownProps.iri)),
});

export default connect(mapStateToProps)(Resource);
