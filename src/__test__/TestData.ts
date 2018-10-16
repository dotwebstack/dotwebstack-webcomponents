import { defaultGraph, literal, namedNode, quad } from 'rdf-data-model';

export const namedNodeSubject1 = namedNode('https://example.org/test');
export const namedNodeSubject2 = namedNode('https://example.org/test5');
export const namedNodePredicate1 = namedNode('http://example.org/test1');
export const namedNodePredicate2 = namedNode('http://example.org/test6');
export const namedNodeObject1 = namedNode('http://example.org/test3');
export const namedNodeObject2 = namedNode('http://example.org/test4');

export const literal1 = literal('test');
export const literal2 = literal('test2');

export const defaultGraph1 = defaultGraph();

export const quadWith1 = quad(namedNodeSubject1, namedNodePredicate1, namedNodeObject1, defaultGraph1);
export const quadWithPredicateObject2 = quad(namedNodeSubject1, namedNodePredicate2, namedNodeObject2, defaultGraph1);

export const quadWithLiteral1 = quad(namedNodeSubject1, namedNodePredicate1, literal1, defaultGraph1);
export const quadWithLiteral2 = quad(namedNodeSubject1, namedNodePredicate1, literal2, defaultGraph1);

export const quadWithObject2 = quad(namedNodeSubject1, namedNodePredicate1, namedNodeObject2, defaultGraph1);

export const quadWithSubject2 = quad(namedNodeSubject2, namedNodePredicate1, namedNodeObject2, defaultGraph1);

export const quadWithPredicate2 = quad(namedNodeSubject2, namedNodePredicate2, namedNodeObject1, defaultGraph1);
