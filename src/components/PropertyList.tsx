import React from 'react';
import { namedNode } from 'rdf-data-model';
import Resource from '../lib/Resource';
import { localName, matchResource } from '../utils';
import { RDFS } from '../namespaces';

type Props = {
  propertyResources: Resource[],
};

const propertyList: React.StatelessComponent<Props> = ({ propertyResources }) => (
  <ol className="list-unstyled">
    {propertyResources.map((propertyResource) => {
      const subPropertyResources = propertyResources.filter(
        matchResource(undefined, namedNode(RDFS + 'subPropertyOf'), propertyResource.iri));

      const superPropertyResources = propertyResources.filter(
        matchResource(propertyResource.iri, namedNode(RDFS + 'subPropertyOf')));

      return (
        <li key={propertyResource.iri.value} id={localName(propertyResource.iri)}>
          <h3>{localName(propertyResource.iri)}</h3>
          <a href={propertyResource.iri.value}>{propertyResource.iri.value}</a>
          <table className="table">
            <tbody>
              {superPropertyResources.length > 0 && (
                <tr>
                  <th scope="row">Subklasse van:</th>
                  <td>
                    <ul className="list-unstyled">
                      {superPropertyResources.map(superPropertyResource => (
                        <li key={superPropertyResource.iri.value}>
                          <a href={superPropertyResource.iri.value}>{localName(superPropertyResource.iri)}</a>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
              {subPropertyResources.length > 0 && (
                <tr>
                  <th scope="row">Heeft subklassen:</th>
                  <td>
                    <ul className="list-unstyled">
                      {subPropertyResources.map(subPropertyResource => (
                        <li key={subPropertyResource.iri.value}>
                          <a href={subPropertyResource.iri.value}>{localName(subPropertyResource.iri)}</a>
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
