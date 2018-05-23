import { BlankNode, DefaultGraph, Literal, NamedNode, Quad } from './model';

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
      subject: NamedNode | BlankNode,
      predicate: NamedNode,
      object: NamedNode | BlankNode | Literal) {
    return new Quad(subject, predicate, object);
  }

  quad(
      subject: NamedNode | BlankNode,
      predicate: NamedNode,
      object: NamedNode | BlankNode | Literal,
      graph?: NamedNode | BlankNode | DefaultGraph) {
    return new Quad(subject, predicate, object, graph);
  }
}

export default DataFactory;
