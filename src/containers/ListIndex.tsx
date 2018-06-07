import { Link } from 'react-scroll';
import React from 'react';
import { Nav } from 'reactstrap';

export interface OwnProps {
  readonly keys: string[];
  readonly title?: string;
}

const lexicographic = (a: any, b: any) => (a.localeCompare(b));

function getNavigationIndexFromSortedMapKeys(keys: string[], title?: string) {
  return <div className="sticky-top">
    <h2>{title}</h2>
    <Nav className="navbar navbar-default static ">
      <ol className="nav navbar-nav">
        {keys.sort(lexicographic).map(key => (
          <Link to={'container' + key} spy={true} smooth={true} key={key}>{key}</Link>
        ))}
      </ol>
    </Nav>
  </div>;
}

const ListIndex: React.StatelessComponent<OwnProps> = (props) => {
  return getNavigationIndexFromSortedMapKeys(props.keys, props.title);
};

export default ListIndex;
