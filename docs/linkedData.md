# Linked Data Reference

To display vocabularies we use a number of ontologies, but do not worry. Most of these are commonly used for linked data.

- DCT 'http://purl.org/dc/terms/';
- OWL 'http://www.w3.org/2002/07/owl#';
- RDF 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
- RDFS 'http://www.w3.org/2000/01/rdf-schema#';
- SKOS 'http://www.w3.org/2004/02/skos/core#';
- SHACL 'http://www.w3.org/ns/shacl#';

## Components

The following components use predefined subjects, predicates or objects to display data:

### &lt;ClassList>

To display subclasses:
- RDFS:subClassOf

To display properties:
- SHACL:targetClass
- SHACL:property
- SHACL:path

### &lt;PropertyList>

PropertyList uses the same as ClassList with one addition.

To display related classes:
- SHACL:class
  
### &lt;ClassTree>

To display sub IRIs:
- RDFS:subClassOf
  
### &lt;PropertyTree>

To display sub IRIs:
- RDFS:subClassOf

### &lt;ConceptList>

To Find concepts:
- <SKOS:Concept> <RDF:type>

To display definition:
- SKOS:definition

To display broader concepts:
- SKOS:broder

To display related concepts:
- SKOS:related

### &lt;Label>

To display label:
- SKOS:preflabel

For fallback labels (If preflabel is not defined)
- RDFS:label

### ### &lt;Vocabulary>

To find classIRIs:
- ? <RDF:type> [<RDFS:Class>, <OWL:Class>]

to find propertyIRIs:
- ? <RDF:type> [<RDF:Property>, <OWL:DatatypeProperty>, <OWL:ObjectProperty>]
