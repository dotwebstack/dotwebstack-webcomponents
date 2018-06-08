import React from 'react';
import { Table, Container, Row, Col } from 'reactstrap';
import { Element, Link } from 'react-scroll';

interface OwnProps {
  readonly clazz: any;
    // {title: string, link: string, definition: string, values: any};
}

const VocabObject: React.StatelessComponent<OwnProps> = (props) => {
  const { clazz } = props;

  return (
    <Container fluid>
      <Element name={'container' + clazz.title}>
        <Row>
          <Col>
            <Row><h2>{clazz.title}</h2></Row>
            <Row><a href={clazz.link}>{clazz.link}</a></Row>
            <Row>
              <p>
                {clazz.description}
              </p>
            </Row>
            {!clazz.hasOwnProperty('values') ? null :
              (<Table>
                <tbody>
                  {Object.keys(clazz.values).map(key => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>
                        {clazz.values[key].map(item => (
                          <p key={key + clazz.values[key].indexOf(item)}>
                            <Link to={'container' + item.label} smooth>
                              <a href={item.link}>{item.label}</a>
                            </Link>
                          </p>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
        <br/>
      </Element>
    </Container>
  );
};

export default VocabObject;
