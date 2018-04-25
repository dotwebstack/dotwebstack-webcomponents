import Term, { TermType } from './Term';

class NamedNode implements Term {

  readonly termType = TermType.NamedNode;

  constructor(readonly value: string) {}

  equals(other: Term) {
    if (!(other instanceof NamedNode)) {
      return false;
    }

    const namedNode: NamedNode = other;

    return namedNode.value === this.value;
  }

}

export default NamedNode;
