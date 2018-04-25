import Quad from './Quad';
import { BlankNode, DefaultGraph, Literal, NamedNode, Variable } from './term';

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

  variable(value: string): Variable {
    return new Variable(value);
  }

  defaultGraph(): DefaultGraph {
    return new DefaultGraph();
  }

  triple(
      subject: BlankNode | NamedNode | Variable,
      predicate: NamedNode | Variable,
      object: BlankNode | NamedNode | Literal | Variable) {
    return new Quad(subject, predicate, object);
  }

  quad(
      subject: BlankNode | NamedNode | Variable,
      predicate: NamedNode | Variable,
      object: BlankNode | NamedNode | Literal | Variable,
      graph?: BlankNode | DefaultGraph | NamedNode | Variable) {
    return new Quad(subject, predicate, object, graph);
  }

}

export default DataFactory;
