import { NamedNode, Term, TermType } from '.';

class Literal implements Term {
  readonly termType = TermType.Literal;

  constructor(
      readonly value: string,
      readonly language: string = '',
      readonly dataType: NamedNode = new NamedNode('http://www.w3.org/2001/XMLSchema#string')) {}

  equals(other: Term) {
    if (!(other instanceof Literal)) {
      return false;
    }

    const literal: Literal = other;

    return literal.value === this.value
      && literal.language === this.language
      && literal.dataType.equals(this.dataType);
  }
}

export default Literal;
