import React from 'react';
import ScrollableAnchor from 'react-scrollable-anchor';
import { Term } from 'rdf-js';
import { namedNode } from 'rdf-data-model';
import Store from '../lib/Store';
import { compareTerm, localName } from '../utils';
import { DCT, RDFS, SHACL, SKOS } from '../namespaces';

type Props = {
  propertyIris: Term[],
  classIris: Term[],
  store: Store,
};

const findDefinition = (propertyIri: Term, store: Store): Term | undefined => {
  const definition = store.findObjects(propertyIri, namedNode(SKOS + 'definition'))[0];

  if (definition !== undefined) {
    return definition;
  }

  const conceptIri = store.findObjects(propertyIri, namedNode(DCT + 'subject'))[0];

  if (conceptIri === undefined) {
    return undefined;
  }

  return store.findObjects(conceptIri, namedNode(SKOS + 'definition'))[0];
};

const findSuperPropertyIris = (propertyIri: Term, store: Store): Term[] =>
  store.findObjects(propertyIri, namedNode(RDFS + 'subPropertyOf'));

const findSubPropertyIris = (propertyIri: Term, store: Store): Term[] =>
  store.findSubjects(namedNode(RDFS + 'subPropertyOf'), propertyIri);

const findUsedInClassIris = (propertyIri: Term, store: Store): Term[] =>
  store.findSubjects(namedNode(SHACL + 'path'), propertyIri)
    .reduce(
      (acc: Term[], propertyShapeIri: Term) => {
        const classShapeIri = store.findSubjects(namedNode(SHACL + 'property'), propertyShapeIri)[0];

        if (classShapeIri === undefined) {
          return acc;
        }

        const classIri = store.findObjects(classShapeIri, namedNode(SHACL + 'targetClass'))[0];

        if (classIri === undefined) {
          throw new Error(`No class found for class shape ${classShapeIri.value}`);
        }

        return [
          ...acc,
          classIri,
        ];
      },
      [],
    );

const findRelatedClassIri = (propertyIri: Term, store: Store): Term | undefined =>
  store.findSubjects(namedNode(SHACL + 'path'), propertyIri)
    .reduce(
      (acc: Term | undefined, propertyShapeIri) => {
        if (acc !== undefined) {
          return acc;
        }

        return store.findObjects(propertyShapeIri, namedNode(SHACL + 'class'))[0];
      },
      undefined,
    );

const determineHref = (termList: Term[], toFindTerm: Term) : string => {
  const foundClassIri = termList.filter(term => term.equals(toFindTerm));
  if (foundClassIri.length === 0) {
    return toFindTerm.value;
  }
  return '#' + localName(toFindTerm);
};

const PropertyList: React.StatelessComponent<Props> = ({ propertyIris, classIris, store }) => (
  <ol className="list-unstyled">
    {propertyIris.map((propertyIri) => {
      const definition = findDefinition(propertyIri, store);
      const superPropertyIris = findSuperPropertyIris(propertyIri, store).sort(compareTerm);
      const subPropertyIris = findSubPropertyIris(propertyIri, store).sort(compareTerm);
      const usedInClassIris = findUsedInClassIris(propertyIri, store).sort(compareTerm);
      const relatedClassIri = findRelatedClassIri(propertyIri, store);

      return (
        <ScrollableAnchor key={localName(propertyIri)} id={localName(propertyIri)}>
            <li>
              <h3>{localName(propertyIri)}</h3>
              <a href={propertyIri.value}>{propertyIri.value}</a>
              {definition && (
                <p>{definition.value}</p>
              )}
              <table className="table">
                <tbody>
                  {superPropertyIris.length > 0 && (
                    <tr>
                      <th scope="row">Subeigenschap van:</th>
                      <td>
                        <ol className="list-unstyled">
                          {superPropertyIris.map(superPropertyIri => (
                            <li key={superPropertyIri.value}>
                              <a href={determineHref(propertyIris, superPropertyIri)}>
                                {localName(superPropertyIri)}
                                </a>
                            </li>
                          ))}
                        </ol>
                      </td>
                    </tr>
                  )}
                  {subPropertyIris.length > 0 && (
                    <tr>
                      <th scope="row">Heeft subeigenschappen:</th>
                      <td>
                        <ol className="list-unstyled">
                          {subPropertyIris.map(subPropertyIri => (
                            <li key={subPropertyIri.value}>
                              <a href={determineHref(propertyIris, subPropertyIri)}>
                                {localName(subPropertyIri)}
                                </a>
                            </li>
                          ))}
                        </ol>
                      </td>
                    </tr>
                  )}
                  {usedInClassIris.length > 0 && (
                    <tr>
                      <th scope="row">Eigenschap van:</th>
                      <td>
                        <ol className="list-unstyled">
                          {usedInClassIris.map(propertyClassIris => (
                            <li key={propertyClassIris.value}>
                              <a href={determineHref(classIris, propertyClassIris)}>
                                {localName(propertyClassIris)}
                              </a>
                            </li>
                          ))}
                        </ol>
                      </td>
                    </tr>
                  )}
                  {relatedClassIri && (
                    <tr>
                      <th scope="row">Gerelateerde klasse:</th>
                      <td>
                        <a href={determineHref(classIris, relatedClassIri)}>
                          {localName(relatedClassIri)}
                          </a>
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

export default PropertyList;
