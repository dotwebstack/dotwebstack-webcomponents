import React from 'react';
import { Container } from 'reactstrap';
import VocabObject from './VocabObject';

export interface Props {
  readonly clazzes: any;
}

const VocabListTable: React.StatelessComponent<Props> = (props) => {
  const { clazzes } = props;

  return (
    <Container fluid>
      {Object.keys(clazzes).map(key => (
        <VocabObject clazz={clazzes[key]} key={key}/>
      ))}
    </Container>
  );
};

export default VocabListTable;
