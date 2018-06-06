import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import ListIndex from '../components/Vocabulary/ListIndex';
import ClassList from '../components/Vocabulary/ClassList';
import PropertyList from '../components/Vocabulary/PropertyList';
import Quad from '../model/Quad';
import { connect } from 'react-redux';
import GraphState from '../model/GraphState';
import DataFactory from '../DataFactory';
import { findSingleStatement } from '../utils';

import { nest } from 'd3-collection';

export interface StateProps {
  readonly quads: Quad[];
}

export function groupingFunction(map: any, quad: Quad) {
  const groupBy = quad.subject.value.toLocaleUpperCase();
  map[groupBy] = map[groupBy] || [];
  map[groupBy].push(quad);

  return map;
}

class Vocabulary extends React.Component<StateProps> {

  // groupedQuads = this.props.quads.reduce(groupingFunction, Object.create(null));

  groupedQuads = nest()
    .key((quad: any) => (quad.subject.value))
    .entries(this.props.quads);

  console.log('grpupedQuads', groupedQuads);

  dataFactory = new DataFactory();
  groupedPerType = nest()
    .key((quads: any) => (findSingleStatement(quads, undefined, this.dataFactory.namedNode('rdf:type')).object.value))
    .entries(this.groupedQuads);
  
  console.log('groupedPerType', groupedPerType);

  render() {
    return (
      <Container fluid>
        <Row>
          <Col md="3" className="hidden-xs hiddena-sm">
            <ListIndex/>
          </Col>
          <Col md="7">
            <section>
              <ClassList clazzes={this.groupedPerType['http://www.w3.org/2002/07/owl#Class']}/>
            </section>
            <section>
              <PropertyList/>
            </section>
          </Col>
        </Row>

      </Container>
    );
  }
}

const mapStateToProps = (state: GraphState): StateProps => ({
  quads: state.quads,
});

export default connect(mapStateToProps)(Vocabulary);
