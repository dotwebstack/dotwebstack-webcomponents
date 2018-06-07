import React from 'react';
import { TupleContext, TupleList } from '..';
import { Container, Row, Col } from 'reactstrap';

const url = 'https://data.pdok.nl/ld/dws/v1/doc/begrippen';

export default () => (
  <Container fluid>
    <Row>
      <Col>
        <h1>Tuple List</h1>
      </Col>
    </Row>
    <Row>
      <Col>
        <TupleContext src={url}>
          <TupleList
            columns={[
              { binding: 'begrip', labelBinding: 'label', header: 'row' , className: 'col-md-3' },
              { binding: 'definition', className: 'col-md-9'  },
            ]}
            tableProps={{ size: 'md' }}
            // Optional groupingFunction={groupingFunction}
          />
        </TupleContext>
      </Col>
    </Row>
  </Container>
);
