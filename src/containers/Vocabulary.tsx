import React from 'react';
import { connect } from 'react-redux';
import { GraphState, Quad } from '../model';
import { Dictionary, find, groupBy, values } from 'ramda';
import { Col, Row } from 'reactstrap';
import ListIndex from './ListIndex';
import Concepts from '../components/Concepts';
import DataFactory from '../DataFactory';
import Concept from '../model/Concept';

export interface StateProps {
  readonly quads: Quad[];
}

export interface OwnProps {
  readonly subjectFilter: string;
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
  const classes = Object.create({});
  const concepts = Object.create({});
  const properties = Object.create({});

  function mapToMap(subject: string) {
    const type = find(q => q.predicate.equals(rdfType), allQuads[subject]) || '';

    if (type) {
      switch (type.object.value) {
        case owlClass.value: {
          classes[subject] = allQuads[subject];
          break;
        }
        case coreConcept.value: {
          concepts[subject] = allQuads[subject];
          break;
        }
        case owlDatatypeProperty.value: {
          concepts[subject] = allQuads[subject];
          properties[subject] = allQuads[subject];
          break;
        }
        case owlObjectProperty.value: {
          concepts[subject] = allQuads[subject];
          properties[subject] = allQuads[subject];
          break;
        }
        case shaclNodeShape.value: {
          concepts[subject] = allQuads[subject];
          break;
        }
        case shaclPropertyShape.value: {
          concepts[subject] = allQuads[subject];
          break;
        }
        default: {
          return;
        }
      }
    }
  }

  Object.keys(allQuads).forEach(mapToMap);

  return [classes, properties, concepts];
}

function getSubjectAndLabel(quad: Quad, quads: Dictionary<Quad[]>) {
  const path = quads.hasOwnProperty(quad.object.value) ?
    find(quad => quad.predicate.equals(shaclPath), quads[quad.object.value]) || quad : quad;

  const label = quads.hasOwnProperty(path.object.value) ?
    find(quad => quad.predicate.equals(prefLabel) || quad.predicate.equals(rdfsLabel), quads[path.object.value]) : '';

  return { link: quad.object.value, label: label ? label.object.value : '' };
}

function mapQuadsToConcept(subject: string, quads: Quad[], concepts: Dictionary<Quad[]>) {
  const termSubject: Quad | undefined = find(quad => quad.predicate.equals(termsSubject), quads);
  const subjectHack = subject.replace('#', '/'); // dirty hack (JA)

  const termConcepts = termSubject ? concepts[termSubject.object.value] : [];
  const propertyConcepts = concepts && concepts.hasOwnProperty(subjectHack) ? concepts[subjectHack] : [];

  const titleQuad = find(concept => concept.predicate.equals(prefLabel) || concept.predicate.equals(rdfsLabel), quads);
  const definitionQuad = find(concept => concept.predicate.equals(coreDefinition), termConcepts);
  const narrowerQuads: Quad[] = termConcepts.filter(concept => concept.predicate.equals(coreNarrower));
  const broaderQuads: Quad[] = termConcepts.filter(concept => concept.predicate.equals(coreBroader));
  const shaclProperties: Quad[] = propertyConcepts.filter(concept => concept.predicate.equals(shaclProperty));

  const title = titleQuad ? titleQuad.object.value : '';
  const description = definitionQuad ? definitionQuad.object.value : 'no definition';
  const vocabObject = new Concept(subject, title, description);
  const quadToPropertyObject = (quad: Quad) => getSubjectAndLabel(quad, concepts);

  if (broaderQuads.length !== 0) {
    vocabObject.add('Broader', broaderQuads.map(quadToPropertyObject));
  }
  if (narrowerQuads.length !== 0) {
    vocabObject.add('Narrower', narrowerQuads.map(quadToPropertyObject));
  }

  if (shaclProperties.length !== 0) {
    vocabObject.add('Properties', shaclProperties.map(quadToPropertyObject));
  }

  return vocabObject;
}

function getClassesAndPropertiesFromMap(quads: Quad[], subjectFilter: string) {
  const [classes, properties, concepts] = groupByRdfType(quads);
  console.log(subjectFilter);

  const mappedClasses = Object.keys(classes)
    .filter(subject => (subject.match(subjectFilter)))
    .map((subject: string) => (mapQuadsToConcept(subject, classes[subject], concepts)))
    .filter((concept: Concept) => (concept.title !== ''))
    .reduce((map, concept: Concept) => ({ ...map, [concept.title]: concept }), {});

  const mappedProperties = Object.keys(properties)
    .filter(subject => (subject.match(subjectFilter)))
    .map((subject: string) => (mapQuadsToConcept(subject, properties[subject], concepts)))
    .filter((concept: Concept) => (concept.title !== ''))
    .reduce((map, concept: Concept) => ({ ...map, [concept.title]: concept }), {});

  return [mappedClasses, mappedProperties];
}

const Vocabulary: React.StatelessComponent<Props> = ({ quads, subjectFilter }) => {
  const [mappedClasses, mappedProperties] = getClassesAndPropertiesFromMap(quads, subjectFilter);

  return (
    <Row>
      <Col md="3">
        <div className="sticky-top">
          <ListIndex keys={Object.keys(mappedClasses)} title={'Klassen'} sticky={false}/>
          <ListIndex keys={Object.keys(mappedProperties)} title={'Eigenschappen'} sticky={false}/>
        </div>
      </Col>
      <Col md="9">
        <Concepts concepts={values(mappedClasses)}/>
        <Concepts concepts={values(mappedProperties)}/>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: GraphState): StateProps => ({
  quads: state.quads,
});

export default connect(mapStateToProps)(Vocabulary);
