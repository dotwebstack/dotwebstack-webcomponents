import { Term } from 'rdf-js';

type BindingSet = {
  [name: string]: Term;
};

export type SparqlResponse = {
  head: {
    vars: String[];
  };
  results: {
    bindings: {
      [key: string]: Term;
    }[];
  };
};

export class TupleResult {
  bindingSet: BindingSet[] = [];
  bindingNames: String[] = [];

  constructor(dataResponse?: SparqlResponse) {
    if (dataResponse) {
      this.bindingSet = this.setBindingSet(dataResponse);
      this.bindingNames = dataResponse.head.vars;
    }
  }

  setBindingSet(response: SparqlResponse): BindingSet[] {
    return response.results.bindings.map((row) => {
      const bindingSet: BindingSet = {};
      Object.keys(row).forEach((key) => {
        bindingSet[key] = row[key];
      });
      return bindingSet;
    });
  }

  getBindingNames() {
    return this.bindingNames;
  }
  getBindingSets() {
    return this.bindingSet;
  }
}
