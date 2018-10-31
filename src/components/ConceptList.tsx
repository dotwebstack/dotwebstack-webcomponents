import React from 'react';
import { namedNode } from '@rdfjs/data-model';
import Store from '../lib/Store';
import { RDF, RDFS, SKOS } from '../namespaces';
import { isLocal, localName } from '../utils';
import ScrollableAnchor from 'react-scrollable-anchor';
import i18next from '../i18n';

type Props = {
  store: Store,
};

const ConceptList: React.StatelessComponent<Props> = ({ store }) => {
  const conceptIris = store.findSubjects(namedNode(RDF + 'type'), namedNode(SKOS + 'Concept'));

  return (
    <section>
      <ol className="list-unstyled">
        {conceptIris.map((conceptIri) => {
          const label = store.findObjects(conceptIri, namedNode(RDFS + 'label'))[0];
          const definition = store.findObjects(conceptIri, namedNode(SKOS + 'definition'))[0];
          const broaderConceptIris = store.findObjects(conceptIri, namedNode(SKOS + 'broader'));
          const relatedConceptIris = store.findObjects(conceptIri, namedNode(SKOS + 'related'));

          return (
            <ScrollableAnchor key={localName(conceptIri)} id={localName(conceptIri)}>
              <li>
                <h3>{label ? label.value : localName(conceptIri)}</h3>
                <a href={conceptIri.value}>{conceptIri.value}</a>
                {definition && (
                  <p>{definition.value}</p>
                )}
                {(broaderConceptIris.length > 0 || relatedConceptIris.length) > 0 && (
                  <table className="table">
                    <tbody>
                    {broaderConceptIris.length > 0 && (
                      <tr>
                        <th scope="row">{i18next.t('broader')}:</th>
                        <td>
                          <ol className="list-unstyled">
                            {broaderConceptIris.map((broaderConceptIri) => {
                              const label = store.findObjects(broaderConceptIri, namedNode(RDFS + 'label'))[0];
                              return (
                                <li key={broaderConceptIri.value}>
                                  <a
                                    href={isLocal(broaderConceptIri, conceptIris) ?
                                      `#${localName(broaderConceptIri)}` : broaderConceptIri.value}>
                                    {label ? label.value : localName(broaderConceptIri)}
                                  </a>
                                </li>
                              );
                            })}
                          </ol>
                        </td>
                      </tr>
                    )}
                    {relatedConceptIris.length > 0 && (
                      <tr>
                        <th scope="row">{i18next.t('related')}:</th>
                        <td>
                          <ol className="list-unstyled">
                            {relatedConceptIris.map((relatedConceptIri) => {
                              const label = store.findObjects(relatedConceptIri, namedNode(RDFS + 'label'))[0];
                              return (
                                <li key={relatedConceptIri.value}>
                                  <a href={isLocal(relatedConceptIri, conceptIris) ?
                                    `#${localName(relatedConceptIri)}` : relatedConceptIri.value}>
                                    {label ? label.value : localName(relatedConceptIri)}
                                  </a>
                                </li>
                              );
                            })}
                          </ol>
                        </td>
                      </tr>
                    )}
                    </tbody>
                  </table>
                )}
              </li>
            </ScrollableAnchor>
          );
        })}
      </ol>
    </section>
  );
};

export default ConceptList;
