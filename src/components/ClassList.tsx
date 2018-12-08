import React from 'react';
import ScrollableAnchor from 'react-scrollable-anchor';
import { Term } from 'rdf-js';
import { namedNode } from '@rdfjs/data-model';
import Store from '../lib/Store';
import { compareTerm, isLocal, isNamedNode, localName, findDefinition, findComment } from '../utils';
import { RDFS, SHACL } from '../namespaces';
import i18next from '../i18n';
import Value from './Value';
import Label from './Label';

type Props = {
  classIris: Term[],
  propertyIris: Term[],
  store: Store,
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

const ClassList: React.StatelessComponent<Props> = ({ classIris, propertyIris, store }) => {
  const classLinkBuilder = (term: Term) =>
    isLocal(term, classIris) ? `#${localName(term)}` : term.value;

  const propertyLinkBuilder = (term: Term) =>
    isLocal(term, propertyIris) ? `#${localName(term)}` : term.value;

  return (
    <ol className="list-unstyled">
      {classIris.map((classIri) => {
        const comment = findComment(classIri, store);
        const definition = findDefinition(classIri, store);
        const superClassIris = findSuperClassIris(classIri, store).sort(compareTerm);
        const subClassIris = store.findSubIris(classIri, 'subClassOf').sort(compareTerm);
        const classPropertyIris = findPropertyIris(classIri, store).sort(compareTerm);
        const ancestorClassIris = findAncestorClassIris(classIri, store);
        const inheritedPropertyIris = findInheritedPropertyIris(ancestorClassIris, store).sort(compareTerm);

        return (
          <ScrollableAnchor key={classIri.value} id={localName(classIri)}>
            <li>
              <h3>
                <Label
                  store={store}
                  resourceIri={classIri}
                />
              </h3>
              <a href={classIri.value}>{classIri.value}</a>
              {comment && (
                <p>{comment.value}</p>
              )}
              {definition && (
                <p>{definition.value}</p>
              )}
              <table className="table">
                <tbody>
                {superClassIris.length > 0 && (
                  <tr>
                    <th scope="row">{i18next.t('subclass')}:</th>
                    <td>
                      <ol className="list-unstyled">
                        {superClassIris.map(superClassIri => (
                          <li key={superClassIri.value}>
                            <Value
                              term={superClassIri}
                              local={true}
                              linkBuilder={classLinkBuilder}
                            />
                          </li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                )}
                {subClassIris.length > 0 && (
                  <tr>
                    <th scope="row">{i18next.t('hasSubclasses')}:</th>
                    <td>
                      <ol className="list-unstyled">
                        {subClassIris.map(subClassIri => (
                          <li key={subClassIri.value}>
                            <Value
                              term={subClassIri}
                              local={true}
                              linkBuilder={classLinkBuilder}
                            />
                          </li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                )}
                {classPropertyIris.length > 0 && (
                  <tr>
                    <th scope="row">{i18next.t('properties')}:</th>
                    <td>
                      <ol className="list-unstyled">
                        {propertyIris.map(propertyIri => (
                          <li key={propertyIri.value}>
                            <Value
                              term={propertyIri}
                              local={true}
                              linkBuilder={propertyLinkBuilder}
                            />
                          </li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                )}
                {inheritedPropertyIris.length > 0 && (
                  <tr>
                    <th scope="row">{i18next.t('inherited')}:</th>
                    <td>
                      <ol className="list-unstyled">
                        {inheritedPropertyIris.map(inheritedPropertyIri => (
                          <li key={inheritedPropertyIri.value}>
                            <Value
                              term={inheritedPropertyIri}
                              local={true}
                              linkBuilder={propertyLinkBuilder}
                            />
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
};

export default ClassList;
