import React from 'react';
import { Term } from 'rdf-js';
import { namedNode } from 'rdf-data-model';
import Store from '../lib/Store';
import { compareTerm, isNamedNode, localName } from '../utils';
import { DCT, RDFS, SHACL, SKOS } from '../namespaces';
import i18n from '../i18n';

type Props = {
  classIris: Term[],
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

const ClassList: React.StatelessComponent<Props> = ({ classIris, store }) => (
  <ol className="list-unstyled">
    {classIris.map((classIri) => {
      const definition = findDefinition(classIri, store);
      const superClassIris = findSuperClassIris(classIri, store).sort(compareTerm);
      const subClassIris = findSubClassIris(classIri, store).sort(compareTerm);
      const propertyIris = findPropertyIris(classIri, store).sort(compareTerm);
      const ancestorClassIris = findAncestorClassIris(classIri, store);
      const inheritedPropertyIris = findInheritedPropertyIris(ancestorClassIris, store).sort(compareTerm);

      return (
        <li key={classIri.value} id={localName(classIri)}>
          <h3>{localName(classIri)}</h3>
          <a href={classIri.value}>{classIri.value}</a>
          {definition && (
            <p>{definition.value}</p>
          )}
          <table className="table">
            <tbody>
              {superClassIris.length > 0 && (
                <tr>
                  <th scope="row">{i18n.t('subklasse')}:</th>
                  <td>
                    <ol className="list-unstyled">
                      {superClassIris.map(superClassIri => (
                        <li key={superClassIri.value}>
                          <a href={superClassIri.value}>
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
                  <th scope="row">{i18n.t('heeftsubklassen')}:</th>
                  <td>
                    <ol className="list-unstyled">
                      {subClassIris.map(subClassIri => (
                        <li key={subClassIri.value}>
                          <a href={subClassIri.value}>
                            {localName(subClassIri)}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </td>
                </tr>
              )}
              {propertyIris.length > 0 && (
                <tr>
                  <th scope="row">{i18n.t('eigenschappen')}:</th>
                  <td>
                    <ol className="list-unstyled">
                      {propertyIris.map(propertyIri => (
                        <li key={propertyIri.value}>
                          <a href={propertyIri.value}>
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
                  <th scope="row">{i18n.t('geerfde')}:</th>
                  <td>
                    <ol className="list-unstyled">
                      {inheritedPropertyIris.map(inheritedPropertyIri => (
                        <li key={inheritedPropertyIri.value}>
                          <a href={inheritedPropertyIri.value}>
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
      );
    })}
  </ol>
);

export default ClassList;
