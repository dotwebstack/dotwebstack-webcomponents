import { BlankNode, DefaultGraph, NamedNode, Literal } from './term';

class Quad {

  constructor(
      readonly subject: BlankNode | NamedNode,
      readonly predicate: NamedNode,
      readonly object: BlankNode | NamedNode | Literal,
      readonly graph: BlankNode | NamedNode | DefaultGraph = new DefaultGraph()) {}

}

export default Quad;
