import React from 'react';
import { Term } from 'rdf-js';
import { localName } from '../utils';

type Props = {
  resourceIris: Term[];
};

const ListIndex: React.StatelessComponent<Props> = ({ resourceIris }) => {
  return (
    <ul className="nav flex-column">
      {resourceIris.map(resourceIri => (
        <li key={resourceIri.value} className="nav-item">
          <a href={'#' + localName(resourceIri)}>
            {localName(resourceIri)}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default ListIndex;
