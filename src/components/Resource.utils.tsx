import { NamedNode, Quad, Term } from 'rdf-js';
import { last } from 'ramda';

const uniqueTermsReducer = (unique: Term[], term: Term): Term[] =>
  unique.filter(uniqueTerm => uniqueTerm.equals(term)).length ? unique : [...unique, term];

export const uniquePredicates = (statements: Quad[]): NamedNode[] =>
  statements.map(statement => statement.predicate).reduce(uniqueTermsReducer, [])
    .map(p => p as NamedNode);

export const localName = (term: string) => last(term.split(/[\#\/]/)) || term;

export const statementsWithPredicate = (collection: Quad[], predicate: NamedNode): Quad[] =>
  collection.filter(statement => statement.predicate.equals(predicate));
