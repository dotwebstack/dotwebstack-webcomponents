import React from 'react';
import { connect } from 'react-redux';
import { GraphState, Quad } from '../model';
import { Dictionary, groupBy } from 'ramda';
import { Col, Container, Row } from 'reactstrap';
import ListIndex from './ListIndex';
import VocabListTable from '../components/VocabListTable';
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
const prefLabel = dataFactory.namedNode(core + 'prefLabel');
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
      } else if (type && (type.object.equals(owlDatatypeProperty || type.object.equals(owlObjectProperty)))) {
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
  const label = quads[subject].find(quad => quad.predicate.equals(rdfsLabel) || quad.predicate.equals(prefLabel));

  return { link: subject, label: label ? label.object.value : '' };
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
  const termSubject: Quad | undefined = quads.find(quad => quad.predicate.equals(termsSubject));

  const termConcepts = termSubject ? concepts[termSubject.object.value] : [];

  const definitionQuad = termConcepts.find(concept => concept.predicate.equals(coreDefinition));
  const narrowerQuad: Quad[] = termConcepts.filter(concept => concept.predicate.equals(coreNarrower));
  const broaderQuad: Quad[] = termConcepts.filter(concept => concept.predicate.equals(coreBroader));
  const subjectHack = subject.replace('#', '/'); // dirty hack (JA)
  const shaclProperties = nodeShapes.hasOwnProperty(subjectHack) ? nodeShapes[subjectHack].filter(
    quad => quad.predicate.equals(shaclProperty)) : [];

  const vocabObject = {
    link: subject,
    title: (quads.find(quad => quad.predicate.equals(rdfsLabel)) ||
      { object: { value: 'no title' } }).object.value,
    description: definitionQuad ? definitionQuad.object.value : 'no definition',
    values:
      {},
  };

  if (broaderQuad.length !== 0) {
    vocabObject.values['Broader'] = broaderQuad.map(quad => getSubjectAndLabel(quad.object.value, concepts));
  }
  if (narrowerQuad.length !== 0) {
    vocabObject.values['Narrower'] = narrowerQuad.map(quad => getSubjectAndLabel(quad.object.value, concepts));
  }

  if (shaclProperties.length !== 0) {
    vocabObject.values['Properties'] = shaclProperties.map(
      quad => getSubjectAndLabelForProperty(quad.object.value, properties, propertyShapes));
  }

  return vocabObject;
}

function mapQuadsToProperty(subject: string, quads: Quad[], concepts: Dictionary<Quad[]>) {
  const termSubject: Quad | undefined = quads.find(quad => quad.predicate.equals(termsSubject));

  const termConcepts = termSubject ? concepts[termSubject.object.value] : [];

  const definitionQuad = termConcepts.find(concept => concept.predicate.equals(coreDefinition));

  const vocabObject = {
    link: subject,
    title: (quads.find(quad => quad.predicate.equals(rdfsLabel)) ||
      { object: { value: 'no title' } }).object.value,
    description: definitionQuad ? definitionQuad.object.value : 'no definition',
    values:
      {},
  };

  return vocabObject;
}

function getClazzesAndPropertiesFromMap(quads: Quad[]) {
  const [clazzes, concepts, properties, nodeShapes, propertyShapes] = groupByRdfType(quads);
  const mappedClazzes = new Map();
  const mappedProperties = new Map();

  Object.keys(clazzes).map((key: string) => {
    const quadsToClass = mapQuadsToClass(key, clazzes[key], concepts, properties, nodeShapes, propertyShapes);
    mappedClazzes[quadsToClass.title] = quadsToClass;
  });

  Object.keys(properties).map((key: string) => {
    const quadsToProperty = mapQuadsToProperty(key, properties[key], concepts);
    mappedProperties[quadsToProperty.title] = quadsToProperty;
  });

  return [mappedClazzes, mappedProperties];
}

const Vocabulary: React.StatelessComponent<Props> = (props) => {
  const { quads } = props;

  const [mappedClasses, mappedProperties] = getClazzesAndPropertiesFromMap(quads);

  return (
    <Container fluid>
      <Row>
        <Col md="3" className="hidden-xs hidden-sm">
          <div>
            <ListIndex keys={Object.keys(mappedClasses)} title={'Klassen'}/>
          </div>
          <div>
            <ListIndex keys={Object.keys(mappedProperties)} title={'Properties'}/>
          </div>
        </Col>
        <Col md="7">
          <VocabListTable clazzes={mappedClasses}/>
          <VocabListTable clazzes={mappedProperties}/>
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state: GraphState): StateProps => ({
  quads: state.quads,
});

export default connect(mapStateToProps)(Vocabulary);
