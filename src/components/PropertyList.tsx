import React from 'react';
import { Term } from 'rdf-js';
import { namedNode } from 'rdf-data-model';
import Store from '../lib/Store';
import { compareTerm, localName } from '../utils';
import { DCT, RDFS, SKOS } from '../namespaces';

type Props = {
  propertyIris: Term[],
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

const findSuperPropertyIris = (classIri: Term, store: Store): Term[] =>
  store.findObjects(classIri, namedNode(RDFS + 'subPropertyOf'));

const findSubPropertyIris = (classIri: Term, store: Store): Term[] =>
  store.findSubjects(namedNode(RDFS + 'subPropertyOf'), classIri);

const propertyList: React.StatelessComponent<Props> = ({ propertyIris, store }) => (
  <ol className="list-unstyled">
    {propertyIris.map((propertyIri) => {
      const definition = findDefinition(propertyIri, store);
      const superPropertyIris = findSuperPropertyIris(propertyIri, store).sort(compareTerm);
      const subPropertyIris = findSubPropertyIris(propertyIri, store).sort(compareTerm);

      return (
        <li key={propertyIri.value} id={localName(propertyIri)}>
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
                    <ul className="list-unstyled">
                      {superPropertyIris.map(superPropertyIri => (
                        <li key={superPropertyIri.value}>
                          <a href={superPropertyIri.value}>{localName(superPropertyIri)}</a>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
              {subPropertyIris.length > 0 && (
                <tr>
                  <th scope="row">Heeft subeigenschappen:</th>
                  <td>
                    <ul className="list-unstyled">
                      {subPropertyIris.map(subPropertyIri => (
                        <li key={subPropertyIri.value}>
                          <a href={subPropertyIri.value}>{localName(subPropertyIri)}</a>
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

export default propertyList;
