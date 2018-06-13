import React from 'react';
import ConceptElement from './ConceptElement';
import Concept from '../model/Concept';

export interface Props {
  readonly concepts: Concept[];
}

const Concepts: React.StatelessComponent<Props> = ({ concepts }) => {
  return (
    <div>
      {concepts.map(entry => (
        <ConceptElement concept={entry} key={entry.link}/>
      ))}
    </div>
  );
};

export default Concepts;
