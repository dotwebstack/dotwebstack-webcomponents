import React from 'react';
import { connect } from 'react-redux';
import { TableProps, Container, Row, Col, Badge, Nav } from 'reactstrap';
import { TupleState, BindingSet } from '../model';
import { TupleListTable } from '..';
import { Element, Link } from 'react-scroll';

export interface StateProps {
  readonly bindingSets: BindingSet[];
}

export interface OwnProps {
  readonly columns?: any;
  readonly tableProps?: TableProps;
  readonly groupingFunction?: any;
}

export interface Props extends StateProps, OwnProps {}

function defaultGroupingFunction(map: any, binding: BindingSet) {
  const groupBy = binding.label.value.substr(0, 1).toLocaleUpperCase();
  if (groupBy.match(/[a-zA-Z]/i)) {
    map[groupBy] = map[groupBy] || [];
    map[groupBy].push(binding);
  } else {
    map['0-9'] = map['0-9'] || [];
    map['0-9'].push(binding);
  }
  return map;
}

const lexicographic = (a: any, b: any) => (a.localeCompare(b));

function getNavigationIndexFromSortedMapKeys(keys: string[]) {
  return <div className="sticky-top">
    <Nav className="navbar navbar-default static ">
      <ol className="nav navbar-nav">
        {keys.sort(lexicographic).map(key => (
          <Link to={'container' + key} spy={true} smooth={true} key={key}>{key}</Link>
        ))}
      </ol>
    </Nav>
  </div>;
}

function getTupleListTablesFromSortedMap(sortedMap: any, tableProps?: TableProps, columns?: any) {
  return Object.keys(sortedMap).sort(lexicographic).map(key => (
    <Element name={'container' + key} id={'container' + key} key={key}>
      <div className="sticky-top">
        <h1>
          <Badge color="secondary">{key}</Badge>
        </h1>
      </div>
      <TupleListTable bindingSets={sortedMap[key]} tableProps={tableProps} columns={columns}/>
    </Element>
  ));
}

const TupleList: React.StatelessComponent<Props> = (props) => {
  const { bindingSets, tableProps, columns, groupingFunction = defaultGroupingFunction } = props;

  const sortedMap = bindingSets.reduce(groupingFunction, Object.create(null));

  return (
    <Container fluid>
      <Row>
        <Col md="1">
          {getNavigationIndexFromSortedMapKeys(Object.keys(sortedMap))}
        </Col>
        <Col md="11">
          {getTupleListTablesFromSortedMap(sortedMap, tableProps, columns)}
        <div style={{ height: '300px' }}><br/></div>
        </Col>
      </Row>
    </Container>
  );
};

export const mapStateToProps = (state: TupleState): StateProps => ({
  bindingSets: state.bindingSets,
});

export default connect(mapStateToProps)(TupleList);
