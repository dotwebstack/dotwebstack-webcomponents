import { Term, TermType } from '.';

class BlankNode implements Term {
  readonly termType = TermType.BlankNode;

  constructor(readonly value: string) {}

  equals(other: Term) {
    if (!(other instanceof BlankNode)) {
      return false;
    }

    const blankNode: BlankNode = other;

    return blankNode.value === this.value;
  }
}

export default BlankNode;
