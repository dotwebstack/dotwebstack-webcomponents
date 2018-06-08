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
const shacl = 'http://www.w3.org/ns/shacl#';

const rdfType = dataFactory.namedNode(rdf + 'type');
const rdfsLabel = dataFactory.namedNode(rdfs + 'label');
const coreConcept = dataFactory.namedNode(core + 'Concept');
const coreDefinition = dataFactory.namedNode(core + 'definition');
const coreBroader = dataFactory.namedNode(core + 'broader');
const coreNarrower = dataFactory.namedNode(core + 'narrower');
const owlClass = dataFactory.namedNode((owl + 'Class'));
const owlDatatypeProperty = dataFactory.namedNode(owl + 'DatatypeProperty');
const owlObjectProperty = dataFactory.namedNode(owl + 'ObjectProperty');
const shaclNodeShape = dataFactory.namedNode(shacl + 'NodeShape');
const shaclPropertyShape = dataFactory.namedNode(shacl + 'PropertyShape');
const shaclProperty = dataFactory.namedNode(shacl + 'property');
const shaclPath = dataFactory.namedNode(shacl + 'path');
const termsSubject = dataFactory.namedNode(terms + 'subject');

function groupByRdfType(quads: Quad[]) {
  const allQuads = groupBy(quad => quad.subject.value, quads);
  const clazzes = Object.create({});
  const concepts = Object.create({});
  const properties = Object.create({});
  const nodeShapes = Object.create({});
  const propertyShapes = Object.create({});
  Object.keys(allQuads).forEach(
    (subject) => {
      const type = allQuads[subject].find(q => q.predicate.equals(rdfType));
      if (type && type.object.equals(owlClass)) {
        clazzes[subject] = allQuads[subject];
      } else if (type && type.object.equals(coreConcept)) {
        concepts[subject] = allQuads[subject];
      } else if (type && type.object.equals(owlDatatypeProperty)) {
        properties[subject] = allQuads[subject];
      } else if (type && type.object.equals(owlObjectProperty)) {
        properties[subject] = allQuads[subject];
      } else if (type && type.object.equals(shaclNodeShape)) {
        nodeShapes[subject] = allQuads[subject];
      } else if (type && type.object.equals(shaclPropertyShape)) {
        propertyShapes[subject] = allQuads[subject];
      }
    });

  return [clazzes, concepts, properties, nodeShapes, propertyShapes];
}

function getSubjectAndLabel(subject: string, quads: Dictionary<Quad[]>) {
  const label = quads[subject].find(quad => quad.predicate.equals(rdfsLabel));
  return { link: subject, label: label ? label.object.value : null };
}

function getSubjectAndLabelForProperty(subject: string, properties: Dictionary<Quad[]>,
                                       propertyShapes: Dictionary<Quad[]>) {
  const path = propertyShapes.hasOwnProperty(subject) ? propertyShapes[subject].find(
    quad => quad.predicate.equals(shaclPath)) : null;
  const label = path ? properties.hasOwnProperty(path.object.value) ? properties[path.object.value].find(
    quad => quad.predicate.equals(rdfsLabel)) : null : null;
  return { link: subject, label: label ? label.object.value : null };
}

function mapQuadsToClass(subject: string, quads: Quad[], concepts: Dictionary<Quad[]>, properties: Dictionary<Quad[]>,
                         nodeShapes: Dictionary<Quad[]>, propertyShapes: Dictionary<Quad[]>) {
  let definitionQuad = null;
  let narrowerQuad = null;
  let broaderQuad = null;
  const termSubject: Quad | undefined = quads.find(quad => quad.predicate.equals(termsSubject));
  definitionQuad = termSubject ? concepts[termSubject.object.value].find(
    concept => concept.predicate.equals(coreDefinition)) : null;
  narrowerQuad = termSubject ? concepts[termSubject.object.value].filter(
      concept => concept.predicate.equals(coreNarrower)) : null;
  broaderQuad = termSubject ? concepts[termSubject.object.value].filter(
      concept => concept.predicate.equals(coreBroader)) : null;

  const subjectHack = subject.replace('#', '/'); // dirty hack (JA)
  const shaclProperties = nodeShapes.hasOwnProperty(subjectHack) ? nodeShapes[subjectHack].filter(
    quad => quad.predicate.equals(shaclProperty)) : null;

  return (
    {
      link: subject,
      title: (quads.find(quad => quad.predicate.equals(rdfsLabel)) ||
        { object: { value: 'no title' } }).object.value,
      description: definitionQuad ? definitionQuad.object.value : 'no definition',
      Narrower: narrowerQuad ? narrowerQuad.map(quad => getSubjectAndLabel(quad.object.value, concepts)) :
        'no narrower',
      'Has subclasses': broaderQuad ? broaderQuad.map(quad => getSubjectAndLabel(quad.object.value, concepts)) :
        'no broader',
      properties: shaclProperties ? shaclProperties.map(
        shaclProp => getSubjectAndLabelForProperty(shaclProp.object.value, properties, propertyShapes))
        : 'no properties',
    });
}

function getClassListFromMap(clazzes: any, concepts: any, properties: any, nodeShapes: any, propertyShapes: any) {
  return Object.keys(clazzes).map(key => (
    <ClassListTable clazz={mapQuadsToClass(key, clazzes[key], concepts, properties, nodeShapes, propertyShapes)}
                    key={key}/>
  ));
}

const Vocabulary: React.StatelessComponent<Props> = (props) => {
  const { quads } = props;

  const [clazzes, concepts, properties, nodeShapes, propertyShapes] = groupByRdfType(quads);
  return (
    <Container fluid>
      <Row>
        <Col md="3" className="hidden-xs hidden-sm">
          <ListIndex />
          <ListIndex />
        </Col>
        <Col md="7">
          <section>
            {getClassListFromMap(clazzes, concepts, properties, nodeShapes, propertyShapes)}
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
