import React from 'react';
import { connect } from 'react-redux';

export interface StateProps {
  readonly loading: boolean;
}

export interface OwnProps {
  readonly children: any;
}

export interface Props extends StateProps {}

const ContextWrapper: React.StatelessComponent<Props> = ({ loading, children }) => {
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

const mapStateToProps = (state: any): StateProps => ({
  loading: state.loading || false,
});

export default connect(mapStateToProps)(ContextWrapper);
