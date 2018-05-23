import React from 'react';
import { connect } from 'react-redux';
import { ContextState } from '../model';
import LoadingIndicator from '../components/LoadingIndicator';

export interface StateProps {
  readonly loading: boolean;
}

export interface OwnProps {
  readonly children: any;
}

export interface Props extends StateProps, OwnProps {}

const ContextWrapper: React.StatelessComponent<Props> = ({ loading, children }) => {
  if (loading) {
    return (
      <LoadingIndicator />
    );
  }

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

const mapStateToProps = (state: ContextState): StateProps => ({
  loading: state.loading,
});

export default connect(mapStateToProps)(ContextWrapper);
