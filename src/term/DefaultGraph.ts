import Term, { TermType } from './Term';

class DefaultGraph implements Term {

  readonly termType = TermType.DefaultGraph;

  readonly value = '';

  equals(other: Term) {
    return (other instanceof DefaultGraph);
  }

}

export default DefaultGraph;
