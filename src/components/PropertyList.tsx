import React from 'react';
import ScrollableAnchor from 'react-scrollable-anchor';
import { Term } from 'rdf-js';
import { namedNode } from '@rdfjs/data-model';
import { uniqWith } from 'lodash';
import Store from '../lib/Store';
import { compareTerm, isLocal, localName, findDefinition, findComment } from '../utils';
import { RDFS, SHACL, XSD } from '../namespaces';
import i18next from '../i18n';
import Value from './Value';
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

const findShaclBasedUsedInClassIris = (propertyShapeIris: Term[], store: Store): Term[] =>
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

const findRdfsDomainUsedInClassIris = (propertyIri: Term, store: Store): Term[] =>
  store.findObjects(propertyIri, namedNode(RDFS + 'domain'));

const findUsedInClassIris = (shaclUsedInClassIris: Term[], rdfsDomainClassIris: Term[]): Term[] => {
  const combined = shaclUsedInClassIris.concat(rdfsDomainClassIris);
  return uniqWith(combined, (term, other) => term.equals(other));
};

const findShaclBasedRelatedClassIri = (propertyShapeIris: Term[], store: Store): Term | undefined =>
  propertyShapeIris.reduce(
    (acc: Term | undefined, propertyShapeIri) => {
      if (acc !== undefined) {
        return acc;
      }

      return store.findObjects(propertyShapeIri, namedNode(SHACL + 'class'))[0];
    },
    undefined,
  );

const findRdfsRangeRelatedClassIri = (propertyIri: Term, store: Store): Term | undefined =>
  store.findObjects(propertyIri, namedNode(RDFS + 'range')).reduce(
    (acc: Term | undefined, related) => {
      if (acc !== undefined) {
        return acc;
      }

      // Filter out XSD datatypes
      // TODO: this is quite crude, and doesn't filter out other datatypes.
      if(related.value.indexOf(XSD) !== 0) {
        return related;
      }
    },
    undefined,
  );

const findRelatedClassIri = (shaclRelatedClassIris: Term | undefined, rdfsRangeClassIri: Term | undefined): Term | undefined =>
  shaclRelatedClassIris ? shaclRelatedClassIris : rdfsRangeClassIri;

const PropertyList: React.StatelessComponent<Props> = ({ propertyIris, classIris, store }) => {
  const classLinkBuilder = (term: Term) =>
    isLocal(term, classIris) ? `#${localName(term)}` : term.value;

  const propertyLinkBuilder = (term: Term) =>
    isLocal(term, propertyIris) ? `#${localName(term)}` : term.value;

  return (
    <ol className="list-unstyled">
      {propertyIris.map((propertyIri) => {
        const comment = findComment(propertyIri, store);
        const definition = findDefinition(propertyIri, store);
        const superPropertyIris = findSuperPropertyIris(propertyIri, store).sort(compareTerm);
        const subPropertyIris = findSubPropertyIris(propertyIri, store).sort(compareTerm);
        const propertyShapeIris = findPropertyShapes(propertyIri, store);
        const shaclUsedInClassIris = findShaclBasedUsedInClassIris(propertyShapeIris, store);
        const rdfsDomainClassIris = findRdfsDomainUsedInClassIris(propertyIri, store);
        const usedInClassIris = findUsedInClassIris(shaclUsedInClassIris, rdfsDomainClassIris).sort(compareTerm);
        const shaclRelatedClassIri = findShaclBasedRelatedClassIri(propertyShapeIris, store);
        const rdfsRangeClassIri = findRdfsRangeRelatedClassIri(propertyIri, store);
        const relatedClassIri = findRelatedClassIri(shaclRelatedClassIri, rdfsRangeClassIri);

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
                            <Value
                              term={superPropertyIri}
                              local={true}
                              linkBuilder={propertyLinkBuilder}
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
                            <Value
                              term={subPropertyIri}
                              local={true}
                              linkBuilder={propertyLinkBuilder}
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
                            <Value
                              term={propertyClassIri}
                              local={true}
                              linkBuilder={classLinkBuilder}
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
                      <Value
                        term={relatedClassIri}
                        local={true}
                        linkBuilder={classLinkBuilder}
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
};

export default PropertyList;
