export const enum TermType {
  BlankNode = 'BlankNode',
  DefaultGraph = 'DefaultGraph',
  NamedNode = 'NamedNode',
  Literal = 'Literal',
}

interface Term {

  readonly termType: TermType;

  readonly value: string;

  equals(other: Term): boolean;

}

export default Term;
