import { DCT, RDF, RDFS, PROV, XSD } from './namespaces';
import { namedNode } from '@rdfjs/data-model';
import { NamedNode } from 'rdf-js';

const generateVocab = (namespace: string, localNames: string[]) => {
  const vocab: { [key: string]: NamedNode } = {};
  localNames.forEach(localName => vocab[localName] = namedNode(`${namespace}${localName}`));
  return vocab;
};

export const dct = generateVocab(DCT, [
  'description',
  'title',
  'created',
  'issued',
  'identifier',
  'hasVersion',
  'isReplacedBy',
  'replaces',
  'publisher',
]);

export const rdf = generateVocab(RDF, [
  'type'
]);

export const rdfs = generateVocab(RDFS, [
  'label'
]);

export const prov = generateVocab(PROV, [
  'Entity'
]);

export const xsd = generateVocab(XSD, [
  'decimal',
  'string',
  'dateTime',
  'date',
  'boolean',
  'int',
  'integer',
]);
