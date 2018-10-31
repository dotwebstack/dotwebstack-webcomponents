import { Term, NamedNode, Literal, BlankNode, Variable } from 'rdf-js';
import { namedNode, literal, blankNode } from '@rdfjs/data-model';

type BindingSet = {
  [name: string]: Term;
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
      return literal(node.value,  (node.datatype) ? node.datatype : node['xml:lang']);
    }
    if (node.type === 'bnode') {
      return blankNode(node.value);
    }
    throw TypeError('Given Term is not a valid Node.');
  }

  getBindingNames() {
    return this.bindingNames;
  }
  getBindingSets() {
    return this.bindingSet;
  }
}
