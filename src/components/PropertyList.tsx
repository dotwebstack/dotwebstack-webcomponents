import React from 'react';
import ScrollableAnchor from 'react-scrollable-anchor';
import { Term } from 'rdf-js';
import { namedNode } from '@rdfjs/data-model';
import Store from '../lib/Store';
import { compareTerm, isLocal, localName, findDefinition, findComment } from '../utils';
import { RDFS, SHACL } from '../namespaces';
import i18next from '../i18n';
import TermValue from './TermValue';
import Label from './Label';

type Props = {
  propertyIris: Term[],
  classIris: Term[],
  store: Store,
};

const findPropertyShapes = (propertyIri: Term, store: Store): Term[] =>
  store.findSubjects(namedNode(SHACL + 'path'), propertyIri);

const findSuperPropertyIris = (propertyIri: Term, store: Store): Term[] =>
  store.findObjects(propertyIri, namedNode(RDFS + 'subPropertyOf'));

const findSubPropertyIris = (propertyIri: Term, store: Store): Term[] =>
  store.findSubjects(namedNode(RDFS + 'subPropertyOf'), propertyIri);

const findUsedInClassIris = (propertyShapeIris: Term[], store: Store): Term[] =>
  propertyShapeIris.reduce(
    (acc: Term[], propertyShapeIri: Term) => {
      const classShapeIri = store.findSubjects(namedNode(SHACL + 'property'), propertyShapeIri)[0];

      if (classShapeIri === undefined) {
        return acc;
      }

      const classIri = store.findObjects(classShapeIri, namedNode(SHACL + 'targetClass'))[0];

      if (classIri === undefined) {
        return [...acc];
      }

      return [
        ...acc,
        classIri,
      ];
    },
    [],
  );

const findRelatedClassIri = (propertyShapeIris: Term[], store: Store): Term | undefined =>
  propertyShapeIris.reduce(
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
      const comment = findComment(propertyIri, store);
      const definition = findDefinition(propertyIri, store);
      const superPropertyIris = findSuperPropertyIris(propertyIri, store).sort(compareTerm);
      const subPropertyIris = findSubPropertyIris(propertyIri, store).sort(compareTerm);
      const propertyShapeIris = findPropertyShapes(propertyIri, store);
      const usedInClassIris = findUsedInClassIris(propertyShapeIris, store).sort(compareTerm);
      const relatedClassIri = findRelatedClassIri(propertyShapeIris, store);

      return (
        <ScrollableAnchor key={localName(propertyIri)} id={localName(propertyIri)}>
          <li>
            <h3>
              <Label
                store={store}
                resourceIri={propertyIri}
              />
            </h3>
            <a href={propertyIri.value}>{propertyIri.value}</a>
            {comment && (
              <p>{comment.value}</p>
            )}
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
                          <TermValue
                            term={superPropertyIri}
                            local={isLocal(superPropertyIri, propertyIris)}
                          />
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
                          <TermValue
                            term={subPropertyIri}
                            local={isLocal(subPropertyIri, propertyIris)}
                          />
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
                      {usedInClassIris.map(propertyClassIri => (
                        <li key={propertyClassIri.value}>
                          <TermValue
                            term={propertyClassIri}
                            local={isLocal(propertyClassIri, classIris)}
                          />
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
                    <TermValue
                      term={relatedClassIri}
                      local={isLocal(relatedClassIri, classIris)}
                    />
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
