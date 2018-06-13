import React from 'react';
import { Table } from 'reactstrap';
import { Element, Link } from 'react-scroll';
import Concept from '../model/Concept';

interface OwnProps {
  readonly concept: Concept;
}

function createTableForConcept(concept: Concept) {
  return (
    <Table>
      <tbody>
      {concept.properties.map(property => (
        <tr key={property}>
          <th scope="row">{property}</th>
          <td>
            {concept.getProperty(property).map(property => (
              <p key={property.label}>
                <Link to={'container' + property.label} smooth href={'#'}>
                  {property.label}
                </Link>
              </p>
            ))}
          </td>
        </tr>
      ))}
      </tbody>
    </Table>
  );
}

const ConceptElement: React.StatelessComponent<OwnProps> = ({ concept }) => {
  return (
    <Element name={'container' + concept.title}>
      <h2>{concept.title}</h2>
      <a href={concept.link}>{concept.link}</a>
      <p>{concept.description}</p>
      {createTableForConcept(concept)}
    </Element>
  );
};

export default ConceptElement;
