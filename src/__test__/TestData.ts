import { defaultGraph, literal, namedNode, quad } from '@rdfjs/data-model';
import { RDF, RDFS, SKOS, DCT, SHACL, OWL } from '../namespaces';

export const subjectTypeRdf = namedNode(RDF + 'test');
export const subjectTest5 = namedNode('https://example.org/test5');

export const predicatePropertyRdf = namedNode(RDF + 'Property');
export const predicateType = namedNode(RDF + 'type');
export const predicateRdfsLabel = namedNode(RDFS + 'label');
export const predicateDefinition = namedNode(SKOS + 'definition');
export const predicateBroader = namedNode(SKOS + 'broader');
export const predicateSkosLabel = namedNode(SKOS + 'prefLabel');
export const predicateRelated = namedNode(SKOS + 'related');
export const predicateSubject = namedNode(DCT + 'subject');
export const predicateSubClassOf = namedNode(RDFS + 'subClassOf');
export const predicateTargetClass = namedNode(SHACL + 'targetClass');
export const predicatePropertyShacl = namedNode(SHACL + 'property');
export const predicatePath = namedNode(SHACL + 'path');
export const predicateSubPropertyOf = namedNode(RDFS + 'subPropertyOf');
export const predicateClassShacl = namedNode(SHACL + 'class');
export const predicateIsDefinedBy = namedNode(RDFS + 'isDefinedBy');

export const objectConceptSkos = namedNode(SKOS + 'Concept');
export const objectTest1 = namedNode('http://example.org/test1');
export const objectTest2 = namedNode('http://example.org/test2');
export const objectTest3 = namedNode('http://example.org/test3');
export const objectTest4 = namedNode('http://example.org/test4');

export const objectClassRdfs = namedNode(RDFS + 'Class');
export const objectClassOwl = namedNode(OWL + 'Class');
export const objectObjectProperty = namedNode(OWL + 'ObjectProperty');
export const objectDatatypeProperty = namedNode(OWL + 'DatatypeProperty');

export const literal1 = literal('test');
export const literal2 = literal('test2');

export const defaultGraph1 = defaultGraph();

export const quadWithIsDefinedBy = quad(
  objectTest1,
  predicateIsDefinedBy,
  subjectTest5,
  defaultGraph1,
);
export const quadWithTypeClassOwl = quad(
  objectTest1,
  predicateType,
  objectClassOwl,
  defaultGraph1,
);
export const quadWithTypeClassRdfs = quad(
  objectTest1,
  predicateType,
  objectClassRdfs,
  defaultGraph1,
);
export const quadWithTypeToPropertyRdf = quad(
  objectTest1,
  predicateType,
  predicatePropertyRdf,
  defaultGraph1,
);
export const quadWithTypeToDatatypeProperty = quad(
  objectTest1,
  predicateType,
  objectDatatypeProperty,
  defaultGraph1,
);
export const quadWithTypeToObjectProperty = quad(
  objectTest1,
  predicateType,
  objectObjectProperty,
  defaultGraph1,
);

export const quadWith1 = quad(
  subjectTypeRdf,
  predicatePropertyRdf,
  objectConceptSkos,
  defaultGraph1,
);
export const quadWithPredicateObject2 = quad(
  subjectTypeRdf,
  predicateType,
  objectTest1,
  defaultGraph1,
);

export const quadWithLiteral1 = quad(
  subjectTypeRdf,
  predicatePropertyRdf,
  literal1,
  defaultGraph1,
);
export const quadWithLiteral2 = quad(
  subjectTypeRdf,
  predicatePropertyRdf,
  literal2,
  defaultGraph1,
);
export const quadWithRdfsLabelLiteral = quad(
  subjectTest5,
  predicateRdfsLabel,
  literal1,
  defaultGraph1,
);
export const quadWithSkosLabelLiteral = quad(
  subjectTest5,
  predicateSkosLabel,
  literal1,
  defaultGraph1,
);
export const quadWithDefinition = quad(
  objectTest1,
  predicateDefinition,
  objectTest4,
);
export const quadWithDefinitionLiteral = quad(
  subjectTest5,
  predicateDefinition,
  literal2,
  defaultGraph1,
);
export const quadWithBroaderConcept = quad(
  subjectTest5,
  predicateBroader,
  objectTest1,
  defaultGraph1,
);
export const quadWithRelatedConcept = quad(
  subjectTest5,
  predicateRelated,
  objectTest2,
  defaultGraph1,
);
export const quadWithDCSubject = quad(
  subjectTest5,
  predicateSubject,
  objectTest1,
  defaultGraph1,
);
export const quadWithSuperClass = quad(
  objectTest4,
  predicateSubClassOf,
  subjectTest5,
  defaultGraph1,
);
export const quadWithSubClass = quad(
  subjectTest5,
  predicateSubClassOf,
  objectTest4,
  defaultGraph1,
);
export const quadWithTargetClass = quad(
  subjectTest5,
  predicateTargetClass,
  objectTest4,
  defaultGraph1,
);
export const quadWithReversedTargetClass = quad(
  objectTest4,
  predicateTargetClass,
  subjectTest5,
  defaultGraph1,
);
export const quadWithProperty = quad(
  subjectTest5,
  predicatePropertyShacl,
  objectTest4,
  defaultGraph1,
);
export const quadWithReversedProperty = quad(
  objectTest4,
  predicatePropertyShacl,
  subjectTest5,
  defaultGraph1,
);
export const quadWithPath = quad(
  objectTest4,
  predicatePath,
  objectTest2,
  defaultGraph1,
);
export const quadWithPathToObject2 = quad(
  subjectTest5,
  predicatePath,
  objectTest1,
  defaultGraph1,
);
export const quadWithSuperProperty = quad(
  objectTest2,
  predicateSubPropertyOf,
  subjectTest5,
  defaultGraph1,
);
export const quadWithSubProperty = quad(
  subjectTest5,
  predicateSubPropertyOf,
  objectTest2,
  defaultGraph1,
);
export const quadWithPropertyToSubject2 = quad(
  objectTest4,
  predicatePropertyShacl,
  subjectTest5,
  defaultGraph1,
);
export const quadWithTargetClassFromObject5 = quad(
  objectTest4,
  predicateTargetClass,
  objectTest2,
  defaultGraph1,
);
export const quadWithClass = quad(
  subjectTest5,
  predicateClassShacl,
  objectTest2,
);

export const quadWithObject2 = quad(
  subjectTypeRdf,
  predicatePropertyRdf,
  objectTest1,
  defaultGraph1,
);

export const quadWithSubject2 = quad(
  subjectTest5,
  predicatePropertyRdf,
  objectTest1,
  defaultGraph1,
);

export const quadWithPredicate2 = quad(
  subjectTest5,
  predicateType,
  objectConceptSkos,
  defaultGraph1,
);

export const quadTree1 = quad(
  objectTest1,
  namedNode(RDFS + 'subPropertyOf'),
  objectTest2,
);

export const quadTree2 = quad(
  objectTest2,
  namedNode(RDFS + 'subPropertyOf'),
  namedNode('http://example.org/test3'),
);

export const quadTree3 = quad(
  namedNode('http://example.org/test3'),
  namedNode(RDFS + 'subPropertyOf'),
  namedNode('http://example.org/test4'),
);

export const quadTree4 = quad(
  objectTest1,
  namedNode(RDFS + 'subPropertyOf'),
  namedNode('http://example.org/test3'),
);

export const quadTree5 = quad(
  objectTest1,
  namedNode(RDFS + 'subPropertyOf'),
  namedNode('http://example.org/test6'),
);

export const quadTree6 = quad(
  objectTest1,
  namedNode(RDFS + 'subClassOf'),
  objectTest2,
);

export const quadTree7 = quad(
  objectTest2,
  namedNode(RDFS + 'subClassOf'),
  namedNode('http://example.org/test3'),
);

export const quadTree8 = quad(
  namedNode('http://example.org/test3'),
  namedNode(RDFS + 'subClassOf'),
  namedNode('http://example.org/test4'),
);

export const quadTree9 = quad(
  objectTest1,
  namedNode(RDFS + 'subClassOf'),
  namedNode('http://example.org/test3'),
);

export const quadTree10 = quad(
  objectTest1,
  namedNode(RDFS + 'subClassOf'),
  namedNode('http://example.org/test6'),
);

export const quadTreeLoop1 = quad(
  objectTest1,
  namedNode(RDFS + 'subClassOf'),
  namedNode('http://example.org/test3'),
);

export const quadTreeLoop2 = quad(
  objectTest1,
  namedNode(RDFS + 'subClassOf'),
  namedNode('http://example.org/test4'),
);

export const quadTreeLoop3 = quad(
  namedNode('http://example.org/test3'),
  namedNode(RDFS + 'subClassOf'),
  namedNode('http://example.org/test4'),
);

export const quadTreeLoop4 = quad(
  namedNode('http://example.org/test4'),
  namedNode(RDFS + 'subClassOf'),
  namedNode('http://example.org/test3'),
);

export const quadTreeLoop5 = quad(
  objectTest1,
  namedNode(RDFS + 'subPropertyOf'),
  namedNode('http://example.org/test3'),
);

export const quadTreeLoop6 = quad(
  objectTest1,
  namedNode(RDFS + 'subPropertyOf'),
  namedNode('http://example.org/test4'),
);

export const quadTreeLoop7 = quad(
  namedNode('http://example.org/test3'),
  namedNode(RDFS + 'subPropertyOf'),
  namedNode('http://example.org/test4'),
);

export const quadTreeLoop8 = quad(
  namedNode('http://example.org/test4'),
  namedNode(RDFS + 'subPropertyOf'),
  namedNode('http://example.org/test3'),
);

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
  graph: { value: '' },
  object: {
    datatype: { value: 'http://www.w3.org/2001/XMLSchema#string' },
    language: '', value: 'Manu Sporny',
  },
  predicate: { value: 'http://schema.org/name' },
  subject: { value: 'b0' },
}, {
  graph: { value: '' },
  object: { value: 'http://manu.sporny.org/' },
  predicate: { value: 'http://schema.org/url' },
  subject: { value: 'b0' },
}];
