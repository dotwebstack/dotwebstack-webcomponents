import React from 'react';
import ScrollableAnchor from 'react-scrollable-anchor';
import { Term } from 'rdf-js';
import { namedNode } from '@rdfjs/data-model';
import Store from '../lib/Store';
import { compareTerm, getUrl, localName } from '../utils';
import { DCT, RDFS, SHACL, SKOS } from '../namespaces';
import i18next from '../i18n';
import * as log from 'loglevel';

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
          log.warn(`No class found for class shape ${classShapeIri.value}`);
          return [...acc];
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
                      <th scope="row">{i18next.t('subproperty')}:</th>
                      <td>
                        <ol className="list-unstyled">
                          {superPropertyIris.map(superPropertyIri => (
                            <li key={superPropertyIri.value}>
                              <a href={getUrl(superPropertyIri, propertyIris)}>
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
                      <th scope="row">{i18next.t('hasSubproperty')}:</th>
                      <td>
                        <ol className="list-unstyled">
                          {subPropertyIris.map(subPropertyIri => (
                            <li key={subPropertyIri.value}>
                              <a href={getUrl(subPropertyIri, propertyIris)}>
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
                      <th scope="row">{i18next.t('propertyOf')}:</th>
                      <td>
                        <ol className="list-unstyled">
                          {usedInClassIris.map(propertyClassIris => (
                            <li key={propertyClassIris.value}>
                              <a href={getUrl(propertyClassIris, classIris)}>
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
                      <th scope="row">{i18next.t('relatedClasses')}:</th>
                      <td>
                        <a href={getUrl(relatedClassIri, classIris)}>
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
