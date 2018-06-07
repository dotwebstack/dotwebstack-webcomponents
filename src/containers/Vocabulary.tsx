import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { GraphState, Quad } from '../model';
import { ListIndex, ClassList, PropertyList } from '..';
import DataFactory from '../DataFactory';
import { findSingleStatement } from '../utils';
import { nest } from 'd3-collection';

export interface StateProps {
  readonly quads: Quad[];
}

export interface OwnProps {
}

export interface Props extends StateProps, OwnProps {}

const dataFactory = new DataFactory();
const predicate = dataFactory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
const types = ['Class', 'DatatypeProperty'];

function getUniqueSubjects(quads: Quad[]) {
  return [...new Set(quads.map(quad => quad.subject.value.split('#')[1]))];
    // .filter(() => (findSingleStatement(quads, undefined, predicate) !== undefined)
  // );
}

function getMappedQuads(quads: Quad[]) {
  const uniqueSubjects = getUniqueSubjects(quads);

  const getTypeKeys = (quad: any) => {
    const element = quad.object.value.split('#')[1];
    return types.indexOf(element) > -1 ? element : 'Overig';
  };

  const getSubjectGroupedQuads = (quad: any) => {
    const element = quad.subject.value.split('#')[1];
    return uniqueSubjects.indexOf(element) > -1 ? element : '';
  };

  return nest()
    .key(getSubjectGroupedQuads)
    .key(getTypeKeys)
    .map(quads);
}

const Vocabulary: React.StatelessComponent<Props> = (props) => {
  const { quads } = props;

  const mapped = getMappedQuads(quads);
  console.log(mapped);
  return mapped.empty() ? null : (
    <Container fluid>
      <Row>
        <Col md="3" className="hidden-xs hiddena-sm">
          <ListIndex /> {/* keys={mapped.get('Class').keys()} */}
          <ListIndex /> {/* keys={mapped.get('DatatypeProperty').keys()} */}
        </Col>
        <Col md="7">
          <section>
            {mapped.keys().filter(key => (types.indexOf(key) > -1)).map(key => (
              <ClassList clazzes={mapped.get(key)} key={key}/>
            ))}
            <PropertyList/>
          </section>
        </Col>
      </Row>

    </Container>
  );
};

const mapStateToProps = (state: GraphState): StateProps => ({
  quads: state.quads,
});

export default connect(mapStateToProps)(Vocabulary);
