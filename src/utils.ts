import log from 'loglevel';
import { last } from 'ramda';
import { Term } from 'rdf-js';
import { SparqlResponse, BindingSet } from './lib/TupleResult';

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

export const sortRows = (a: BindingSet, b: BindingSet, order: string, sortColumn: string) => {
  if (order === 'asc') {
    return compareTerm(a[sortColumn], b[sortColumn]);
  }
  return compareTerm(a[sortColumn], b[sortColumn]) * -1;
};
