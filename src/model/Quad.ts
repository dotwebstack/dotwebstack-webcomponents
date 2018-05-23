import { BlankNode, DefaultGraph, NamedNode, Literal } from '.';

class Quad {
  constructor(
      readonly subject: NamedNode | BlankNode,
      readonly predicate: NamedNode,
      readonly object: NamedNode | BlankNode | Literal,
      readonly graph: NamedNode | BlankNode | DefaultGraph = new DefaultGraph()) {}
}

export default Quad;
