import log from 'loglevel';
import { last } from 'ramda';
import { Term } from 'rdf-js';
import { namedNode } from '@rdfjs/data-model';
import { SparqlResponse, BindingSet } from './lib/TupleResult';
import Store from './lib/Store';
import { SKOS, DCT, RDFS } from './namespaces';

export const localName = (term: Term) => last(term.value.split(/[\#\/]/)) || term.value;

export const compareTerm = (a: Term, b: Term) => localName(a).localeCompare(localName(b));

export const equalsTerm = (term: Term, other: Term) => term.equals(other);

export const isNamedNode = (term: Term) => term.termType === 'NamedNode';

export const isUnique = (object: any, list: any[]) => list.filter(c => c.value === object.value).length === 0;

export const fetchSparqlResult = (url: string): Promise<SparqlResponse> => {
  return fetch(url, { headers: { Accept: 'application/sparql-results+json' } })
      .then(response => response.json())
      .catch((e) => {
        log.error(e);
      });
};

export const isLocal = (term: Term, list: Term[]) => list.some(t => term.equals(t));

export const sortTerm = (termA?: Term, termB?: Term) => {
  if (termA === undefined && termB === undefined) {
    return 0;
  }

  if (termA === undefined) {
    return -1;
  }

  if (termB === undefined) {
    return 1;
  }

  if (isNamedNode(termA) || isNamedNode(termB)) {
    return compareTerm(termA, termB);
  }

  return termA.value.localeCompare(termB.value);
};

export const sortRows = (a: BindingSet, b: BindingSet, ascending: boolean, sortColumn: string) => {
  if (ascending) {
    return sortTerm(a[sortColumn], b[sortColumn]);
  }
  return sortTerm(a[sortColumn], b[sortColumn]) * -1;
};

export const findComment = (resourceIri: Term, store: Store): Term | undefined =>
  store.findObjects(resourceIri, namedNode(RDFS + 'comment'))[0];

export const findDefinition = (resourceIri: Term, store: Store): Term | undefined => {
  const definition = store.findObjects(resourceIri, namedNode(SKOS + 'definition'))[0];

  if (definition !== undefined) {
    return definition;
  }

  const subjectIri = store.findObjects(resourceIri, namedNode(DCT + 'subject'))[0];

  if (subjectIri !== undefined) {
    const subjectDefinition = store.findObjects(subjectIri, namedNode(SKOS + 'definition'))[0];

    if (subjectDefinition !== undefined) {
      return subjectDefinition;
    }
  }

  return undefined;
};

export const applyPrefixes = (iri: string, prefixes: any) => {
  for (const prefix in prefixes) {
    const namespace = prefixes[prefix];
    if (iri.startsWith(namespace)) {
      const iriTail = iri.substring(namespace.length);
      return `${prefix}:${iriTail}`;
    }
  }
  return iri;
};

const convertPrefixMapToEntryList = (prefixMap: any) => {
  const result = [];
  for (const prefix in prefixMap) {
    const namespace = prefixMap[prefix];
    result.push({ prefix, namespace });
  }
  return result;
};

export const mergePrefixMaps = (existingPrefixMap: any, prefixMapToMerge: any) => {
  const existing = convertPrefixMapToEntryList(existingPrefixMap);
  const toMerge = convertPrefixMapToEntryList(prefixMapToMerge);

  const doesNotExistInToMerge = ({ prefix, namespace }: { [key: string]: string }) =>
    !toMerge.some(entry => entry.prefix === prefix || entry.namespace === namespace);
  const result: { [prefix: string]: { namespace: string }} = {};
  existing.filter(doesNotExistInToMerge) // omit any matching prefix OR namespace from existing map
    .concat(toMerge)
    .forEach(({ prefix, namespace }) => result[prefix] = namespace);
  return result;
};
