import React from 'react';
import { Col, Row } from 'reactstrap';
import { NamedNode } from 'rdf-js';
import { namedNode } from 'rdf-data-model';
import { GraphContextProps } from '..';
import ClassList from '../components/ClassList';
import PropertyList from '../components/PropertyList';
import { compareResource, matchResource, quadsToResources } from '../utils';
import { OWL, RDF, RDFS, SHACL } from '../namespaces';

type Props = {
  ontologyIri: NamedNode,
} & GraphContextProps;

const Vocabulary: React.StatelessComponent<Props> = ({ ontologyIri, store }) => {
  const resources = quadsToResources(store);

  const classResources = resources
    .filter(matchResource(undefined, namedNode(RDF + 'type'), [
      namedNode(RDFS + 'Class'),
      namedNode(OWL + 'Class'),
    ]))
    .filter(matchResource(undefined, namedNode(RDFS + 'isDefinedBy'), ontologyIri))
    .sort(compareResource);

  const propertyResources = resources
    .filter(matchResource(undefined, namedNode(RDF + 'type'), [
      namedNode(RDF + 'Property'),
      namedNode(OWL + 'DatatypeProperty'),
      namedNode(OWL + 'ObjectProperty'),
    ]))
    .filter(matchResource(undefined, namedNode(RDFS + 'isDefinedBy'), ontologyIri))
    .sort(compareResource);

  const shapeResources = resources
    .filter(matchResource(undefined, namedNode(RDF + 'type'), [
      namedNode(SHACL + 'NodeShape'),
      namedNode(SHACL + 'PropertyShape'),
    ]));

  return (
    <Row>
      <Col md="3">
        {ontologyIri.value}
      </Col>
      <Col md="9">
        <ClassList
          classResources={classResources}
          shapeResources={shapeResources}
        />
        <PropertyList
          propertyResources={propertyResources}
        />
      </Col>
    </Row>
  );
};

export default Vocabulary;
