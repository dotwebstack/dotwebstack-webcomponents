import { defaultGraph, literal, namedNode, quad } from '@rdfjs/data-model';
import { RDF, SKOS } from '../namespaces';

export const subject1 = namedNode(RDF + 'test');
export const subject2 = namedNode('https://example.org/test5');
export const predicate1 = namedNode(RDF + 'Property');
export const predicate2 = namedNode(RDF + 'type');
export const object1 = namedNode(SKOS + 'Concept');
export const object2 = namedNode('http://example.org/test4');

export const literal1 = literal('test');
export const literal2 = literal('test2');

export const defaultGraph1 = defaultGraph();

export const quadWith1 = quad(subject1, predicate1, object1, defaultGraph1);
export const quadWithPredicateObject2 = quad(subject1, predicate2, object2, defaultGraph1);

export const quadWithLiteral1 = quad(subject1, predicate1, literal1, defaultGraph1);
export const quadWithLiteral2 = quad(subject1, predicate1, literal2, defaultGraph1);

export const quadWithObject2 = quad(subject1, predicate1, object2, defaultGraph1);

export const quadWithSubject2 = quad(subject2, predicate1, object2, defaultGraph1);

export const quadWithPredicate2 = quad(subject2, predicate2, object1, defaultGraph1);

export const fooJsonLd = {
  'http://schema.org/name': [{ '@value': 'Manu Sporny' }],
  'http://schema.org/url': [{ '@id': 'http://manu.sporny.org/' }],
  'http://schema.org/image': [{ '@id': 'http://manu.sporny.org/images/manu.png' }],
};

export const parsedJsonLd = [{
  graph: { value: '' },
  object: { value: 'http://manu.sporny.org/images/manu.png' },
  predicate: { value: 'http://schema.org/image' },
  subject: { value: 'b0' },
}, {
  graph:{ value: '' },
  object: {datatype: { value: 'http://www.w3.org/2001/XMLSchema#string' },
    language: '', value: 'Manu Sporny'},
  predicate: { value: 'http://schema.org/name' },
  subject: { value: 'b0' }}, {graph: { value: '' },
    object: { value: 'http://manu.sporny.org/' },
    predicate: { value: 'http://schema.org/url' },
    subject: { value: 'b0' },
  }];
