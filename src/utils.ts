import { Term } from 'rdf-js';
import { last } from 'ramda';
import { SparqlResponse } from './lib/TupleResult';
import log from 'loglevel';

export const localName = (term: Term) => last(term.value.split(/[\#\/]/)) || term.value;

export const compareTerm = (a: Term, b: Term) => localName(a).localeCompare(localName(b));

export const isNamedNode = (term: Term) => term.termType === 'NamedNode';

export const isUnique = (object: any, list: any[]) => list.filter(c => c.value === object.value).length === 0;

export function fetchSparqlResult(url: string): Promise<SparqlResponse> {
  return fetch(url, { headers: { Accept: 'application/sparql-results+json' } })
      .then(response => response.json())
      .catch((e) => {
        log.error(e);
      });
}

export const isLocal = (term: Term, list: Term[]) => list.some(t => term.equals(t));

export const sortRows = (a: any, b: any, order: string, sortColumn: string) => {
  if (order === 'desc') {
    if (a[sortColumn].value > b[sortColumn].value) {
      return -1;
    } if (a[sortColumn].value < b[sortColumn].value) {
      return 1;
    }
    return 0;
  }
  if (a[sortColumn].value < b[sortColumn].value) {
    return -1;
  }  if (a[sortColumn].value > b[sortColumn].value) {
    return 1;
  }
  return 0;
};
