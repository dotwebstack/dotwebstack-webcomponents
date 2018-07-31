import React from 'react';
import { find } from 'ramda';
import { Term } from 'rdf-js';
import { namedNode } from 'rdf-data-model';
import Resource from '../lib/Resource';
import { compareTerm, localName, matchQuad, matchResource, matchResourceIri } from '../utils';
import { RDFS, SHACL } from '../namespaces';

type Props = {
  classResources: Resource[],
  shapeResources: Resource[],
};

const findSuperClassIris = (classResource: Resource, classResources: Resource[]): Term[] => {
  const superClassIris = classResource.quads
    .filter(matchQuad(classResource.iri, namedNode(RDFS + 'subClassOf')))
    .map(subClassStatement => subClassStatement.object);

  return superClassIris.reduce(
    (acc, superClassIri) => {
      const superClassResource = find(matchResourceIri(superClassIri), classResources);

      if (superClassResource === undefined) {
        return [...acc, superClassIri];
      }

      return [...acc, superClassIri, ...findSuperClassIris(superClassResource, classResources)];
    },
    [] as Term[],
  );
};

const findSubClassIris = (classIri: Term, classResources: Resource[]): Term[] => {
  return classResources
    .filter(matchResource(undefined, namedNode(RDFS + 'subClassOf'), classIri))
    .map(subClassResource => subClassResource.iri);
};

const findPropertyIris = (classIri: Term, shapeResources: Resource[]): Term[] => {
  const classShapeResource = find(
    matchResource(undefined, namedNode(SHACL + 'targetClass'), classIri), shapeResources);

  if (!classShapeResource) {
    return [];
  }

  return classShapeResource.quads
    .filter(matchQuad(classShapeResource.iri, namedNode(SHACL + 'property')))
    .map((propertyStatement) => {
      const propertyShapeResource = find(matchResourceIri(propertyStatement.object), shapeResources);

      if (propertyShapeResource === undefined) {
        throw new Error(`Property shape ${propertyStatement.object.value} not found.`);
      }

      return propertyShapeResource;
    })
    .map((propertyShapeResource) => {
      const pathStatement = find(
        matchQuad(propertyShapeResource.iri, namedNode(SHACL + 'path')), propertyShapeResource.quads);

      if (pathStatement === undefined) {
        throw new Error(`Path statement for ${propertyShapeResource.iri.value} not found.`);
      }

      return pathStatement.object;
    });
};

const findInheritedPropertyIris = (superClassIris: Term[], shapeResources: Resource[]): Term[] => {
  return superClassIris.reduce(
    (acc: Term[], superClassIri: Term): Term[] => [...acc, ...findPropertyIris(superClassIri, shapeResources)],
    [],
  );
};

const ClassList: React.StatelessComponent<Props> = ({ classResources, shapeResources }) => (
  <ol className="list-unstyled">
    {classResources.map((classResource) => {
      const subClassIris = findSubClassIris(classResource.iri, classResources).sort(compareTerm);
      const superClassIris = findSuperClassIris(classResource, classResources).sort(compareTerm);
      const propertyIris: Term[] = findPropertyIris(classResource.iri, shapeResources).sort(compareTerm);
      const inheritedPropertyIris: Term[] = findInheritedPropertyIris(superClassIris, shapeResources).sort(compareTerm);

      return (
        <li key={classResource.iri.value}>
          <h2>{localName(classResource.iri)}</h2>
          <a href={classResource.iri.value}>{classResource.iri.value}</a>
          <table className="table">
            <tbody>
              {superClassIris.length > 0 && (
                <tr>
                  <th scope="row">Subklasse van:</th>
                  <td>
                    <ul className="list-unstyled">
                      {superClassIris.map(superClassIri => (
                        <li key={superClassIri.value}>
                          <a href={superClassIri.value}>
                            {localName(superClassIri)}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
              {subClassIris.length > 0 && (
                <tr>
                  <th scope="row">Heeft subklassen:</th>
                  <td>
                    <ul className="list-unstyled">
                      {subClassIris.map(subClassIri => (
                        <li key={subClassIri.value}>
                          <a href={subClassIri.value}>
                            {localName(subClassIri)}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
              {propertyIris.length > 0 && (
                <tr>
                  <th scope="row">Eigenschappen:</th>
                  <td>
                    <ul className="list-unstyled">
                      {propertyIris.map(propertyIri => (
                        <li key={propertyIri.value}>
                          <a href={propertyIri.value}>
                            {localName(propertyIri)}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
              {inheritedPropertyIris.length > 0 && (
                <tr>
                  <th scope="row">Ge&euml;rfde Eigenschappen:</th>
                  <td>
                    <ul className="list-unstyled">
                      {inheritedPropertyIris.map(inheritedPropertyIri => (
                        <li key={inheritedPropertyIri.value}>
                          <a href={inheritedPropertyIri.value}>
                            {localName(inheritedPropertyIri)}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </li>
      );
    })}
  </ol>
);

export default ClassList;
