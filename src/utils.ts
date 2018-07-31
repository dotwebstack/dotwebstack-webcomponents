import { Term, Quad } from 'rdf-js';
import { any, groupWith, last } from 'ramda';
import Resource from './lib/Resource';

export const localName = (term: Term) =>
  term.termType === 'NamedNode' ? last(term.value.split(/[\#\/]/)) : undefined;

export const isNamedNode = (term: Term) => term.termType === 'NamedNode';

export const isBlankNode = (term: Term) => term.termType === 'BlankNode';

export const quadsToResources = (quads: Quad[]): Resource[] =>
  groupWith((a, b) => a.subject.equals(b.subject), quads)
    .map(group => new Resource(group[0].subject, group));

export const matchQuad = (subject?: Term, predicate?: Term, object?: Term | Term[]) => (quad: Quad): boolean =>
  (subject === undefined || subject.equals(quad.subject)) &&
  (predicate === undefined || predicate.equals(quad.predicate)) &&
  (object === undefined || any(o => o.equals(quad.object), Array.isArray(object) ? object : [object]));

export const matchResource = (subject?: Term, predicate?: Term, object?: Term | Term[]) => (resource: Resource) =>
  any(matchQuad(subject, predicate, object), resource.quads);

export const matchResourceIri = (iri: Term) => (resource: Resource) => iri.equals(resource.iri);

export const lexicographicSort = (a: any, b: any): number => a.localeCompare(b);

export const compareTerm = (a: Term, b: Term) => lexicographicSort(localName(a), localName(b));

export const compareResource = (a: Resource, b: Resource) => compareTerm(a.iri, b.iri);
