import { Link } from 'react-scroll';
import React from 'react';
import { Nav } from 'reactstrap';
import { lexicographicSort } from '../utils';

export interface OwnProps {
  readonly keys: string[];
  readonly title?: string;
  readonly sortFn?: any;
}

const ListIndex: React.StatelessComponent<OwnProps> = (props) => {
  const { keys, title, sortFn = lexicographicSort } = props;

  return <div className="sticky-top">
    <h2>{title}</h2>
    <Nav vertical>
      {keys.sort(sortFn).map(key => (
        <Link to={'container' + key} spy={true} smooth={true} key={key}>{key}</Link>
      ))}
    </Nav>
  </div>;
};

export default ListIndex;
