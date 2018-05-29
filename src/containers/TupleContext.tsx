import React from 'react';

export interface Props {
  readonly src: string;
  readonly children: any;
}

const TupleContext: React.StatelessComponent<Props> = ({ children }) => (
  <React.Fragment>
    {children}
  </React.Fragment>
);

export default TupleContext;
