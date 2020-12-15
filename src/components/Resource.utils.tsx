import { NamedNode, Quad } from 'rdf-js';
import { last } from 'ramda';
import { uniqueTermsReducer } from '../utils';

export const uniquePredicates = (statements: Quad[]): NamedNode[] =>
  statements.map(statement => statement.predicate).reduce(uniqueTermsReducer, [])
    .map(p => p as NamedNode);

export const localName = (term: string) => last(term.split(/[\#\/]/)) || term;

export const statementsWithPredicate = (collection: Quad[], predicate: NamedNode): Quad[] =>
  collection.filter(statement => statement.predicate.equals(predicate));
