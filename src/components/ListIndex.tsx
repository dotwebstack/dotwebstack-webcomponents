import React from 'react';
import Resource from '../lib/Resource';
import { localName } from '../utils';

type Props = {
  resources: Resource[];
};

const ListIndex: React.StatelessComponent<Props> = ({ resources }) => {
  return (
    <ul className="nav flex-column">
      {resources.map(resource => (
        <li key={resource.iri.value} className="nav-item">
          <a href={'#' + localName(resource.iri)}>
            {localName(resource.iri)}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default ListIndex;
