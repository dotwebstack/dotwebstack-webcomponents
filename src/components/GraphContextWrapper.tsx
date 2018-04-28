import * as React from 'react';
import { connect } from 'react-redux';
import { GraphState } from '../graph';

export interface StateProps {
  readonly loading: boolean;
}

export interface OwnProps {
  readonly children: any;
}

export interface Props extends StateProps {}

const GraphContextWrapper: React.StatelessComponent<Props> = ({ loading, children }) => {
  if (loading) {
    return (
      <p>Loading data...</p>
    );
  }

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

const mapStateToProps = (state: GraphState): StateProps => ({
  loading: state.loading,
});

export default connect<StateProps>(mapStateToProps)(GraphContextWrapper);
