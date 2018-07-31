import { Term, Quad } from 'rdf-js';

export default class Resource {
  iri: Term;
  quads: Quad[];

  constructor(iri: Term, quads: Quad[]) {
    this.iri = iri;
    this.quads = quads;
  }
}
