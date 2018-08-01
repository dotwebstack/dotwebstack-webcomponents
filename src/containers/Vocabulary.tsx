import React from 'react';
import { NamedNode } from 'rdf-js';
import { namedNode } from 'rdf-data-model';
import { GraphContextProps } from '..';
import ClassList from '../components/ClassList';
import PropertyList from '../components/PropertyList';
import ListIndex from '../components/ListIndex';
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
    <div className="row">
      <div className="col-md-3">
        <section>
          <h2>Klassen</h2>
          <ListIndex resources={classResources} />
        </section>
        <section>
          <h2>Eigenschappen</h2>
          <ListIndex resources={propertyResources} />
        </section>
      </div>
      <div className="col-md-9">
        <section>
          <ClassList
            classResources={classResources}
            shapeResources={shapeResources}
          />
        </section>
        <section>
          <PropertyList
            propertyResources={propertyResources}
          />
        </section>
      </div>
    </div>
  );
};

export default Vocabulary;
