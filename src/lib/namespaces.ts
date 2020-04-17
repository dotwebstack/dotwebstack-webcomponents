import { namedNode } from '@rdfjs/data-model';
import { Prefix } from './model';

export const foaf = new Proxy<Prefix>({}, {
  get: (_obj, localName: string) => namedNode(`http://xmlns.com/foaf/0.1/${localName}`),
});

export const prov = new Proxy<Prefix>({}, {
  get: (_obj, localName: string) => namedNode(`http://xmlns.com/foaf/0.1/${localName}`),
});

export const owl = new Proxy<Prefix>({}, {
  get: (_obj, localName: string) => namedNode(`http://www.w3.org/2002/07/owl#${localName}`),
});

export const rdf = new Proxy<Prefix>({}, {
  get: (_obj, localName: string) => namedNode(`http://www.w3.org/1999/02/22-rdf-syntax-ns#${localName}`),
});

export const rdfs = new Proxy<Prefix>({}, {
  get: (_obj, localName: string) => namedNode(`http://www.w3.org/2000/01/rdf-schema#${localName}`),
});

export const skos = new Proxy<Prefix>({}, {
  get: (_obj, localName: string) => namedNode(`http://www.w3.org/2004/02/skos/core#${localName}`),
});

export const xsd = new Proxy<Prefix>({}, {
  get: (_obj, localName: string) => namedNode(`http://www.w3.org/2001/XMLSchema#${localName}`),
});
