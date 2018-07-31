import React from 'react';
import { TableProps } from 'reactstrap';
import { Term } from 'rdf-js';
import PropertyTable from '../components/PropertyTable';
import { GraphContextProps } from '..';

type Props = {
  readonly iri: Term,
  readonly tableProps?: TableProps,
};

const Resource: React.StatelessComponent<Props & GraphContextProps> = (props) => {
  const { store, tableProps } = props;

  return (
    <PropertyTable
      store={store}
      tableProps={tableProps}
    />
  );
};

export default Resource;
