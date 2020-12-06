import { FOAF, DCT, RDF, RDFS, PROV, XSD } from './namespaces';
import { namedNode } from '@rdfjs/data-model';

export const foaf = {
  isPrimaryTopicOf: namedNode(`${FOAF}isPrimaryTopicOf`),
};

export const dct = {
  description: namedNode(`${DCT}description`),
  title: namedNode(`${DCT}title`),
  created: namedNode(`${DCT}created`),
  issued: namedNode(`${DCT}issued`),
  identifier: namedNode(`${DCT}identifier`),
  hasVersion: namedNode(`${DCT}hasVersion`),
  isReplacedBy: namedNode(`${DCT}isReplacedBy`),
  replaces: namedNode(`${DCT}replaces`),
  publisher: namedNode(`${DCT}publisher`),
};

export const rdf = {
  type: namedNode(`${RDF}type`),
};

export const rdfs = {
  label: namedNode(`${RDFS}label`),
};

export const prov = {
  Entity: namedNode(`${PROV}Entity`),
};

export const xsd = {
  decimal: namedNode(`${XSD}decimal`),
  string: namedNode(`${XSD}string`),
  dateTime: namedNode(`${XSD}dateTime`),
  date: namedNode(`${XSD}date`),
  boolean: namedNode(`${XSD}boolean`),
  int: namedNode(`${XSD}int`),
  integer: namedNode(`${XSD}integer`),
};
