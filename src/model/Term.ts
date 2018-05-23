import { TermType } from '.';

interface Term {
  readonly termType: TermType;
  readonly value: string;

  equals(other: Term): boolean;
}

export default Term;
