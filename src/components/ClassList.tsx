import React from 'react';
import ScrollableAnchor from 'react-scrollable-anchor';
import { Term } from 'rdf-js';
import { namedNode } from 'rdf-data-model';
import Store from '../lib/Store';
import { compareTerm, isNamedNode, localName } from '../utils';
import { DCT, RDFS, SHACL, SKOS } from '../namespaces';

type Props = {
  classIris: Term[],
  propertyIris: Term[],
  store: Store,
};

const findDefinition = (classIri: Term, store: Store): Term | undefined => {
  const definition = store.findObjects(classIri, namedNode(SKOS + 'definition'))[0];

  if (definition !== undefined) {
    return definition;
  }

  const conceptIri = store.findObjects(classIri, namedNode(DCT + 'subject'))[0];

  if (conceptIri === undefined) {
    return undefined;
  }

  return store.findObjects(conceptIri, namedNode(SKOS + 'definition'))[0];
};

const findSuperClassIris = (classIri: Term, store: Store): Term[] =>
  store
    .findObjects(classIri, namedNode(RDFS + 'subClassOf'))
    .filter(isNamedNode);

const findAncestorClassIris = (classIri: Term, store: Store): Term[] => {
  const superClassIris = findSuperClassIris(classIri, store);

  return findSuperClassIris(classIri, store).reduce(
    (acc: Term[], superClassIri: Term) =>
      [...acc, ...findAncestorClassIris(superClassIri, store)],
    superClassIris,
  );
};

const findSubClassIris = (classIri: Term, store: Store): Term[] =>
  store
    .findSubjects(namedNode(RDFS + 'subClassOf'), classIri)
    .filter(isNamedNode);

const findPropertyIris = (classIri: Term, store: Store): Term[] => {
  const shapeIri = store.findSubjects(namedNode(SHACL + 'targetClass'), classIri)[0];

  if (!shapeIri) {
    return [];
  }

  return store
    .findObjects(shapeIri, namedNode(SHACL + 'property'))
    .reduce(
      (acc: Term[], propertyShapeIri: Term) => [
        ...acc,
        ...store.findObjects(propertyShapeIri, namedNode(SHACL + 'path')),
      ],
      [],
    );
};

const findInheritedPropertyIris = (ancestorClassIris: Term[], store: Store): Term[] => {
  return ancestorClassIris.reduce(
    (acc: Term[], superClassIri: Term): Term[] =>
      [...acc, ...findPropertyIris(superClassIri, store)],
    [],
  );
};

const determineHref = (termList: Term[], toFindTerm: Term) : string => {
  const foundClassIri = termList.filter(term => term.equals(toFindTerm));
  if (foundClassIri.length === 0) {
    return toFindTerm.value;
  }
  return '#' + localName(toFindTerm);
};

const ClassList: React.StatelessComponent<Props> = ({ classIris, propertyIris, store }) => (
  <ol className="list-unstyled">
    {classIris.map((classIri) => {
      const definition = findDefinition(classIri, store);
      const superClassIris = findSuperClassIris(classIri, store).sort(compareTerm);
      const subClassIris = findSubClassIris(classIri, store).sort(compareTerm);
      const classPropertyIris = findPropertyIris(classIri, store).sort(compareTerm);
      const ancestorClassIris = findAncestorClassIris(classIri, store);
      const inheritedPropertyIris = findInheritedPropertyIris(ancestorClassIris, store).sort(compareTerm);
      return (
        <ScrollableAnchor key={localName(classIri)} id={localName(classIri)}>
          <li>
            <h3>{localName(classIri)}</h3>
            <a href={classIri.value}>{classIri.value}</a>
            {definition && (
              <p>{definition.value}</p>
            )}
            <table className="table">
              <tbody>
                {superClassIris.length > 0 && (
                  <tr>
                    <th scope="row">Subklasse van:</th>
                    <td>
                      <ol className="list-unstyled">
                        {superClassIris.map(superClassIri => (
                          <li key={superClassIri.value}>
                            <a href={determineHref(classIris, superClassIri)}>
                              {localName(superClassIri)}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                )}
                {subClassIris.length > 0 && (
                  <tr>
                    <th scope="row">Heeft subklassen:</th>
                    <td>
                      <ol className="list-unstyled">
                        {subClassIris.map(subClassIri => (
                          <li key={subClassIri.value}>
                            <a href={determineHref(classIris, subClassIri)}>
                              {localName(subClassIri)}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                )}
                {classPropertyIris.length > 0 && (
                  <tr>
                    <th scope="row">Eigenschappen:</th>
                    <td>
                      <ol className="list-unstyled">
                        {propertyIris.map(propertyIri => (
                          <li key={propertyIri.value}>
                            <a href={determineHref(propertyIris, propertyIri)}>
                              {localName(propertyIri)}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                )}
                {inheritedPropertyIris.length > 0 && (
                  <tr>
                    <th scope="row">Ge&euml;rfde Eigenschappen:</th>
                    <td>
                      <ol className="list-unstyled">
                        {inheritedPropertyIris.map(inheritedPropertyIri => (
                          <li key={inheritedPropertyIri.value}>
                            <a href={determineHref(propertyIris, inheritedPropertyIri)}>
                              {localName(inheritedPropertyIri)}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </li>
        </ScrollableAnchor>
      );
    })}
  </ol>
);

export default ClassList;
