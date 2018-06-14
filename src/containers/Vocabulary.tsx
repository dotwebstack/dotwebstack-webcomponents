import React from 'react';
import { connect } from 'react-redux';
import { GraphState, Quad } from '../model';
import { Dictionary, groupBy } from 'ramda';
import { Col, Row } from 'reactstrap';
import ListIndex from './ListIndex';
import Concepts from '../components/Concepts';
import DataFactory from '../DataFactory';
import Concept from '../model/Concept';

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

  function mapToMap(subject: string) {
    const type = allQuads[subject].find(q => q.predicate.equals(rdfType)) || '';

    if (type) {
      switch (type.object.value) {
        case owlClass.value: {
          clazzes[subject] = allQuads[subject];
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

  return [clazzes, properties, concepts];
}

function getSubjectAndLabel(quad: Quad, quads: Dictionary<Quad[]>) {
  const path = quads.hasOwnProperty(quad.object.value) ? quads[quad.object.value]
    .find(quad => quad.predicate.equals(shaclPath)) || quad : quad;

  const label = quads.hasOwnProperty(path.object.value) ? quads[path.object.value]
    .find(quad => quad.predicate.equals(prefLabel) || quad.predicate.equals(rdfsLabel)) : '';

  return { link: quad.object.value, label: label ? label.object.value : '' };
}

function mapQuadsToConcept(subject: string, quads: Quad[], concepts: Dictionary<Quad[]>) {
  const termSubject: Quad | undefined = quads.find(quad => quad.predicate.equals(termsSubject));
  const subjectHack = subject.replace('#', '/'); // dirty hack (JA)

  const termConcepts = termSubject ? concepts[termSubject.object.value] : [];
  const propertyConcepts = concepts && concepts.hasOwnProperty(subjectHack) ? concepts[subjectHack] : [];

  const titleQuad = quads.find(concept => concept.predicate.equals(prefLabel) || concept.predicate.equals(rdfsLabel));
  const definitionQuad = termConcepts.find(concept => concept.predicate.equals(coreDefinition));
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

function getClazzesAndPropertiesFromMap(quads: Quad[]) {
  const [clazzes, properties, concepts] = groupByRdfType(quads);

  const mappedClazzes = Object.keys(clazzes)
    .filter(subject => (subject.includes('.basisregistraties.overheid.nl')))
    .map((subject: string) => (mapQuadsToConcept(subject, clazzes[subject], concepts)))
    .filter((concept: Concept) => (concept.title !== ''))
    .reduce((map: Map<string, Concept>, concept: Concept) => (map.set(concept.title, concept)), new Map);

  const mappedProperties = Object.keys(properties)
    .filter(subject => (subject.includes('.basisregistraties.overheid.nl')))
    .map((subject: string) => (mapQuadsToConcept(subject, properties[subject], concepts)))
    .filter((concept: Concept) => (concept.title !== ''))
    .reduce((map: Map<string, Concept>, concept: Concept) => (map.set(concept.title, concept)), new Map);

  return [mappedClazzes, mappedProperties];
}

const Vocabulary: React.StatelessComponent<Props> = ({ quads }) => {
  const [mappedClasses, mappedProperties] = getClazzesAndPropertiesFromMap(quads);

  return (
    <Row>
      <Col md="3" className="sticky-top scrollable">
        <Row>
          <ListIndex keys={Array.from(mappedClasses.keys())} title={'Klassen'} sticky={false}/>
          <ListIndex keys={Array.from(mappedProperties.keys())} title={'Eigenschappen'} sticky={false}/>
        </Row>
      </Col>
      <Col md="7">
        <Concepts concepts={Array.from(mappedClasses.values())}/>
        <Concepts concepts={Array.from(mappedProperties.values())}/>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: GraphState): StateProps => ({
  quads: state.quads,
});

export default connect(mapStateToProps)(Vocabulary);
