import Quad from './Quad';
import { BlankNode, DefaultGraph, Literal, NamedNode } from './term';

class DataFactory {

  namedNode(value: string): NamedNode {
    return new NamedNode(value);
  }

  blankNode(value: string): BlankNode {
    return new BlankNode(value);
  }

  literal(value: string, languageOrDatatype?: string | NamedNode): Literal {
    if (languageOrDatatype instanceof NamedNode) {
      return new Literal(value, undefined, languageOrDatatype);
    }

    if (languageOrDatatype !== undefined) {
      return new Literal(value, languageOrDatatype);
    }

    return new Literal(value);
  }

  defaultGraph(): DefaultGraph {
    return new DefaultGraph();
  }

  triple(
      subject: BlankNode | NamedNode,
      predicate: NamedNode,
      object: BlankNode | NamedNode | Literal) {
    return new Quad(subject, predicate, object);
  }

  quad(
      subject: BlankNode | NamedNode,
      predicate: NamedNode,
      object: BlankNode | NamedNode | Literal,
      graph?: BlankNode | DefaultGraph | NamedNode) {
    return new Quad(subject, predicate, object, graph);
  }

}

export default DataFactory;
