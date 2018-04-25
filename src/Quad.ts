import { BlankNode, DefaultGraph, NamedNode, Literal, Variable } from './term';

class Quad {

  constructor(
      readonly subject: BlankNode | NamedNode | Variable,
      readonly predicate: NamedNode | Variable,
      readonly object: BlankNode | NamedNode | Literal | Variable,
      readonly graph: BlankNode | DefaultGraph | NamedNode | Variable = new DefaultGraph()) {}

}

export default Quad;
