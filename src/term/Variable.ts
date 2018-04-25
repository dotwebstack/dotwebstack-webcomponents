import Term, { TermType } from './Term';

class Variable implements Term {

  readonly termType = TermType.Variable;

  constructor(readonly value: string) {}

  equals(other: Term) {
    if (!(other instanceof Variable)) {
      return false;
    }

    const variable: Variable = other;

    return variable.value === this.value;
  }

}

export default Variable;
