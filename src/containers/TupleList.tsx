import React from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row, TableProps } from 'reactstrap';
import { BindingSet, TupleState, Column } from '../model';
import { TupleListTable } from '..';
import { Element } from 'react-scroll';
import ListIndex from './ListIndex';
import { lexicographicSort } from '../utils';

export interface StateProps {
  readonly bindingSets: BindingSet[];
}

export interface OwnProps {
  readonly columns: Column[];
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

function getTupleListTablesFromSortedMap(sortedMap: any, columns: Column[], tableProps?: TableProps) {
  return Object.keys(sortedMap).sort(lexicographicSort).map(key => (
    <Element name={'container' + key} id={'container' + key} key={key}>
      <div className="sticky-top">
        <h2>{key}</h2>
      </div>
      <TupleListTable bindingSets={sortedMap[key]} columns={columns} tableProps={tableProps}/>
    </Element>
  ));
}

const TupleList: React.StatelessComponent<Props> = (props) => {
  const { bindingSets, columns, tableProps, groupingFunction = defaultGroupingFunction } = props;

  const sortedMap = bindingSets.reduce(groupingFunction, Object.create(null));

  return (
    <Container fluid>
      <Row>
        <Col md="1">
          <ListIndex keys={Object.keys(sortedMap)} title={'A-Z'}/>
        </Col>
        <Col md="11">
          {getTupleListTablesFromSortedMap(sortedMap, columns, tableProps)}
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
