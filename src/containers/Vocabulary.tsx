import React from 'react';
import { connect } from 'react-redux';
import { GraphState, Quad } from '../model';
import { Dictionary, groupBy } from 'ramda';
import { Col, Container, Row } from 'reactstrap';
import ListIndex from '../components/Vocabulary/ListIndex';
import ClassListTable from '../components/Vocabulary/ClassListTable';
import PropertyList from '../components/Vocabulary/PropertyList';
import DataFactory from '../DataFactory';

export interface StateProps {
  readonly quads: Quad[];
}

export interface OwnProps {
}

export interface Props extends StateProps, OwnProps {}

const dataFactory = new DataFactory();
const rdf = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
const rdfs = 'http://www.w3.org/2000/01/rdf-schema#';
const core = 'http://www.w3.org/2004/02/skos/core#';
const owl = 'http://www.w3.org/2002/07/owl#';
const terms = 'http://purl.org/dc/terms/';

const rdfType = dataFactory.namedNode(rdf + 'type');
const rdfsLabel = dataFactory.namedNode(rdfs + 'label');
const coreConcept = dataFactory.namedNode(core + 'Concept');
const coreDefinition = dataFactory.namedNode(core + 'definition');
const owlClass = dataFactory.namedNode((owl + 'Class'));
const termsSubject = dataFactory.namedNode(terms + 'subject');

function groupByRdfType(quads: Quad[]) {
  const allQuads = groupBy(quad => quad.subject.value, quads);
  const clazzes = Object.create({});
  const concepts = Object.create({});
  Object.keys(allQuads).forEach(
    (subject) => {
      const type = allQuads[subject].find(q => q.predicate.equals(rdfType));
      if (type && type.object.equals(owlClass)) {
        clazzes[subject] = allQuads[subject];
      } else if (type && type.object.equals(coreConcept)) {
        concepts[subject] = allQuads[subject];
      }
    });

  return [clazzes, concepts];
}

function mapQuadsToClass(subject: string, quads: Quad[], concepts: Dictionary<Quad[]>) {
  const termSubject: Quad | undefined = quads.find(quad => quad.predicate.equals(termsSubject));
  let def = 'no definition';
  if (termSubject) {
    const quadsConcept = concepts[termSubject.object.value];
    const definitionQuad = quadsConcept.find(concept => concept.predicate.equals(coreDefinition));
    if (definitionQuad) { def = definitionQuad.object.value; }
  }

  return (
    {
      link: subject,
      title: (quads.find(quad => quad.predicate.equals(rdfsLabel)) ||
        { object: { value: 'no title' } }).object.value,
      definition: def,
    });
}

function getClassListFromMap(clazzes: any, concepts: any) {
  return Object.keys(clazzes).map(key => (
    <ClassListTable clazz={mapQuadsToClass(key, clazzes[key], concepts)} key={key}/>
  ));
}

const Vocabulary: React.StatelessComponent<Props> = (props) => {
  const { quads } = props;

  const [clazzes, concepts] = groupByRdfType(quads);
  return (
    <Container fluid>
      <Row>
        <Col md="3" className="hidden-xs hidden-sm">
          <ListIndex />
          <ListIndex />
        </Col>
        <Col md="7">
          <section>
            {getClassListFromMap(clazzes, concepts)}
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
