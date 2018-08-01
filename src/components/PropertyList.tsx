import React from 'react';
import { Term } from 'rdf-js';
import { namedNode } from 'rdf-data-model';
import Resource from '../lib/Resource';
import { compareTerm, localName, matchQuad, matchResource } from '../utils';
import { RDFS } from '../namespaces';

type Props = {
  propertyResources: Resource[],
};

const findSuperPropertyIris = (propertyResource: Resource): Term[] =>
  propertyResource.quads
    .filter(matchQuad(propertyResource.iri, namedNode(RDFS + 'subPropertyOf')))
    .map(subClassStatement => subClassStatement.object);

const findSubPropertyIris = (propertyIri: Term, propertyResources: Resource[]): Term[] =>
  propertyResources
    .filter(matchResource(undefined, namedNode(RDFS + 'subPropertyOf'), propertyIri))
    .map(subClassResource => subClassResource.iri);

const propertyList: React.StatelessComponent<Props> = ({ propertyResources }) => (
  <ol className="list-unstyled">
    {propertyResources.map((propertyResource) => {
      const superPropertyIris = findSuperPropertyIris(propertyResource).sort(compareTerm);
      const subPropertyIris = findSubPropertyIris(propertyResource.iri, propertyResources).sort(compareTerm);

      return (
        <li key={propertyResource.iri.value} id={localName(propertyResource.iri)}>
          <h3>{localName(propertyResource.iri)}</h3>
          <a href={propertyResource.iri.value}>{propertyResource.iri.value}</a>
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
