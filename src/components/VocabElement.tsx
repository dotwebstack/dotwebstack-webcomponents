import React from 'react';
import { Table } from 'reactstrap';
import { Element, Link } from 'react-scroll';
import Vocab from '../model/Vocab';

interface OwnProps {
  readonly vocab: Vocab;
}

function createTableForVocabObject(vocab: Vocab) {
  return <Table>
    <tbody>
    {vocab.properties.map(property => (
      <tr key={property}>
        <td>{property}</td>
        <td>
          {vocab.getProperty(property).map(property => (
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
  </Table>;
}

const VocabElement: React.StatelessComponent<OwnProps> = (props) => {
  const { vocab } = props;
  return (
    <Element name={'container' + vocab.title}>
      <h2>{vocab.title}</h2>
      <a href={vocab.link}>{vocab.link}</a>
      <p>{vocab.description}</p>
      {createTableForVocabObject(vocab)}
    </Element>
  );
};

export default VocabElement;
