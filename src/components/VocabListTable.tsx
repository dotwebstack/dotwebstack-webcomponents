import React from 'react';
import VocabElement from './VocabElement';
import Vocab from '../model/Vocab';

export interface Props {
  readonly clazzes: Vocab[];
}

const VocabListTable: React.StatelessComponent<Props> = (props) => {
  const { clazzes } = props;

  return (
    <div>
      {clazzes.map(entry => (
        <VocabElement vocab={entry} key={entry.link}/>
      ))}
    </div>
  );
};

export default VocabListTable;
