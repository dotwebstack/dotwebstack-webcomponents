import React from 'react';
import { namedNode } from '@rdfjs/data-model';
import Store from '../lib/Store';
import { RDF, SKOS } from '../namespaces';
import { getUrl, localName } from '../utils';
import ScrollableAnchor from 'react-scrollable-anchor';
import i18next from '../i18n';
import LabelComponent from './LabelComponent';

type Props = {
  store: Store,
};

const ConceptList: React.StatelessComponent<Props> = ({ store }) => {
  const conceptIris = store.findSubjects(namedNode(RDF + 'type'), namedNode(SKOS + 'Concept'));

  return (
    <section>
      <ol className="list-unstyled">
        {conceptIris.map((conceptIri) => {
          const definition = store.findObjects(conceptIri, namedNode(SKOS + 'definition'))[0];
          const broaderConceptIris = store.findObjects(conceptIri, namedNode(SKOS + 'broader'));
          const relatedConceptIris = store.findObjects(conceptIri, namedNode(SKOS + 'related'));

          return (
            <ScrollableAnchor key={localName(conceptIri)} id={localName(conceptIri)}>
              <li>
                <LabelComponent store={store} resourceIri={conceptIri}/>
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
                              return (
                                <li key={broaderConceptIri.value}>
                                  <a href={getUrl(broaderConceptIri, conceptIris)}>
                                    <LabelComponent store={store} resourceIri={broaderConceptIri}/>
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
                              return (
                                <li key={relatedConceptIri.value}>
                                  <a href={getUrl(relatedConceptIri, conceptIris)}>
                                    <LabelComponent store={store} resourceIri={relatedConceptIri}/>
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
