import React from 'react';
import { Table, Row, Col } from 'reactstrap';
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
      <Row>
        <Col>
          <Row>
            <h2>{vocab.title}</h2>
          </Row>
          <Row>
            <a href={vocab.link}>{vocab.link}</a>
          </Row>
          <Row>
            <p>{vocab.description}</p>
          </Row>
          {createTableForVocabObject(vocab)}
        </Col>
      </Row>
    </Element>
  );
};

export default VocabElement;
