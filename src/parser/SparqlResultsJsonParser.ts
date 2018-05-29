import R from 'ramda';
import DataFactory from '../DataFactory';
import { BindingSet } from '../model';

export interface SparqlResultsBindingSet {
  [key: string]: {
    type: string;
    value: string;
    datatype?: string;
    'xml:lang'?: string;
  }
}

export interface SparqlResultsDocument {
  results: {
    bindings: SparqlResultsBindingSet[];
  }
}

class SparqlResultsJsonParser {
  dataFactory: DataFactory = new DataFactory();

  parse(doc: SparqlResultsDocument): BindingSet[] {
    if (!doc.results || !Array.isArray(doc.results.bindings)) {
      throw new Error('Invalid JSON document.');
    }

    const bindingSets: BindingSet[] = doc.results.bindings.map((bindings) => {
      return R.map((binding) => {
        switch (binding.type) {
          case 'uri':
            return this.dataFactory.namedNode(binding.value);
          case 'bnode':
            return this.dataFactory.blankNode(binding.value);
          case 'literal':
            if (binding.datatype) {
              return this.dataFactory.literal(binding.value, this.dataFactory.namedNode(binding.datatype));
            }

            if (binding['xml:lang']) {
              return this.dataFactory.literal(binding.value, binding['xml:lang']);
            }

            return this.dataFactory.literal(binding.value);
          default:
            throw new Error(`Unknown binding type: ${binding.type}`);
        }
      }, bindings);
    });

    return bindingSets;
  }
}

export default SparqlResultsJsonParser;
