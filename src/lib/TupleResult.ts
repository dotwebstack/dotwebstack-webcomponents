import { Term, NamedNode, Literal, BlankNode, Variable } from 'rdf-js';
import { namedNode, literal, blankNode, variable } from '@rdfjs/data-model';

type BindingSet = {
  [name: string]: NamedNode |  Literal | BlankNode | Variable | Term;
};

export type SparqlResponse = {
  head: {
    vars: String[];
  };
  results: {
    bindings: BindingSet[];
  };
};

export class TupleResult {
  private bindingSet: BindingSet[] = [];
  private bindingNames: String[] = [];

  constructor(dataResponse?: SparqlResponse) {
    if (dataResponse) {
      this.bindingSet = this.setBindingSet(dataResponse);
      this.bindingNames = dataResponse.head.vars;
    }
  }

  private setBindingSet(response: SparqlResponse): BindingSet[] {
    return response.results.bindings.map((row) => {
      const bindingSet: BindingSet = {};
      Object.keys(row).forEach((key) => {
        bindingSet[key] = this.getNode(row[key]);
      });
      return bindingSet;
    });
  }
  getNode(node: any): NamedNode | Literal | BlankNode | Variable | Term {
    if (node.type === 'uri') {
      return namedNode(node.value);
    }
    if (node.type === 'literal') {
      return literal(node.value);
    }
    if (node.type === 'blankNode') {
      return blankNode(node.value);
    }
    if (node.type === 'variable') {
      return variable(node.value);
    }
    return node;
  }

  getBindingNames() {
    return this.bindingNames;
  }
  getBindingSets() {
    return this.bindingSet;
  }
}
