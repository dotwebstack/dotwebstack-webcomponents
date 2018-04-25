import { promises } from 'jsonld';
import Quad from './Quad';
import DataFactory from './DataFactory';
import { BlankNode, DefaultGraph, NamedNode, Literal } from './term';

export interface JsonLdDocument {}

interface JsonLdTerm {
  type: string;
  value: string;
  datatype?: string;
  language?: string;
}

interface JsonLdStatement {
  subject: JsonLdTerm;
  predicate: JsonLdTerm;
  object: JsonLdTerm;
}

interface GraphCollection {
  [graph: string]: JsonLdStatement[];
}

class JsonLdParser {

  dataFactory: DataFactory = new DataFactory();

  parse(doc: JsonLdDocument): Promise<Quad[]> {
    return promises.toRDF(doc)
      .then((graphs: GraphCollection) => {
        const quads: Quad[] = [];

        Object.keys(graphs).forEach((graphKey) => {
          const graph = this.toGraph(graphKey);

          graphs[graphKey].forEach((statement) => {
            const quad = this.toQuad(statement, graph);
            quads.push(quad);
          });
        });

        return quads;
      })
      .catch((err: Error) => {
        throw err;
      });
  }

  private toQuad(statement: JsonLdStatement, graph: DefaultGraph | NamedNode): Quad {
    return this.dataFactory.quad(
      this.toSubject(statement.subject),
      this.toPredicate(statement.predicate),
      this.toObject(statement.object),
      graph,
    );
  }

  private toSubject(term: JsonLdTerm): BlankNode | NamedNode {
    switch (term.type) {
      case 'blank node':
        return this.dataFactory.blankNode(term.value);
      case 'IRI':
      default:
        return this.dataFactory.namedNode(term.value);
    }
  }

  private toPredicate(term: JsonLdTerm): NamedNode {
    return this.dataFactory.namedNode(term.value);
  }

  private toObject(term: JsonLdTerm): BlankNode | NamedNode | Literal {
    switch (term.type) {
      case 'literal':
        return this.dataFactory.literal(term.value, term.language
          ? term.language
          : (term.datatype ? this.dataFactory.namedNode(term.datatype) : undefined));
      case 'blank node':
        return this.dataFactory.blankNode(term.value);
      case 'IRI':
      default:
        return this.dataFactory.namedNode(term.value);
    }
  }

  private toGraph(graph: string): DefaultGraph | NamedNode {
    if (graph === '@default') {
      return this.dataFactory.defaultGraph();
    }

    return this.dataFactory.namedNode(graph);
  }

}

export default JsonLdParser;
