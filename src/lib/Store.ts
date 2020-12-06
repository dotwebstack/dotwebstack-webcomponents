import { BlankNode, Literal, NamedNode, Quad, Term, DefaultGraph } from 'rdf-js';
import { reduce } from 'ramda';
import { isNamedNode, isUnique, uniqueTermsReducer } from '../utils';
import { namedNode } from '@rdfjs/data-model';
import { RDFS } from '../namespaces';

type IndexMap = {
  [termValue: string]: {
    [termValue: string]: Term[],
  },
};

export default class Store {
  private quads: Quad[];
  private spoMap: IndexMap;
  private posMap: IndexMap;

  constructor(quads: Quad[]) {
    this.quads = quads;
    this.spoMap = this.buildSpoMap(quads);
    this.posMap = this.buildPosMap(quads);
  }

  private buildSpoMap = (quads: Quad[]): IndexMap =>
    quads.reduce(
      (spoMap: IndexMap, quad: Quad) => ({
        ...spoMap,
        [quad.subject.value]: {
          ...spoMap[quad.subject.value] || {},
          [quad.predicate.value]: [
            ...(spoMap[quad.subject.value] ? spoMap[quad.subject.value][quad.predicate.value] || [] : []),
            quad.object,
          ],
        },
      }),
      {},
    )

  private buildPosMap = (quads: Quad[]): IndexMap =>
    quads.reduce(
      (posMap: IndexMap, quad: Quad) => ({
        ...posMap,
        [quad.predicate.value]: {
          ...posMap[quad.predicate.value] || {},
          [quad.object.value]: [
            ...(posMap[quad.predicate.value] ? posMap[quad.predicate.value][quad.object.value] || [] : []),
            quad.subject,
          ],
        },
      }),
      {},
    )

  filter = (subject: NamedNode | BlankNode | null,
            predicate: NamedNode | null,
            object: NamedNode | BlankNode | Literal | null,
            graph: NamedNode | BlankNode | DefaultGraph | null = null): Store => {
    const pass = () => true;
    const subjectTest: (quad: Quad) => boolean = subject === null ? pass
      : quad => subject.equals(quad.subject);
    const predicateTest: (quad: Quad) => boolean = predicate === null ? pass
      : quad => predicate.equals(quad.predicate);
    const objectTest: (quad: Quad) => boolean = object === null ? pass
      : quad => object.equals(quad.object);
    const graphTest: (quad: Quad) => boolean = graph === null ? pass
      : quad => graph.equals(quad.graph);
    return new Store(this.quads.filter(quad =>
      subjectTest(quad) && predicateTest(quad) && objectTest(quad) && graphTest(quad)));
  }

  subjects = () => this.quads.map(quad => quad.subject)
    .reduce(uniqueTermsReducer, [])
    .map(subject => subject as NamedNode | BlankNode)

  objects = () => this.quads.map(quad => quad.object)
    .reduce(uniqueTermsReducer, [])
    .map(object => object as NamedNode | BlankNode | Literal)

  size = () => this.quads.length;

  findStatements = (subject: Term): Quad[] => {
    return this.quads.filter(quad => quad.subject.equals(subject));
  }

  findStatementsWithObject = (object: Term): Quad[] => {
    return this.quads.filter(quad => quad.object.equals(object));
  }

  findSubjects = (predicate: Term, object: Term | Term[]): Term[] => {
    if (this.posMap[predicate.value] === undefined) {
      return [];
    }

    const objects = Array.isArray(object) ? object : [object];

    return reduce(
      (acc: Term[], o: Term) => [
        ...acc,
        ...(this.posMap[predicate.value][o.value] || []),
      ],
      [] as Term[],
      objects,
    );
  }

  findObjects = (subject: Term, predicate: Term | Term[]): Term[] => {
    if (this.spoMap[subject.value] === undefined) {
      return [];
    }

    const predicates = Array.isArray(predicate) ? predicate : [predicate];

    return reduce(
      (acc: Term[], p: Term) => [
        ...acc,
        ...(this.spoMap[subject.value][p.value] || []),
      ],
      [] as Term[],
      predicates,
    );
  }

  findSuperIris = (iri: Term, type: string): Term[] =>
    this
      .findObjects(iri, namedNode(RDFS + type))
      .filter(isNamedNode)

  findSubIris = (iri: Term, type: string): Term[] =>
    this
      .findSubjects(namedNode(RDFS + type), iri)
      .filter(isNamedNode)

  findRoots = (terms: Term[], rootTerms: Term[], type: string): Term[] => {
    terms.forEach((term) => {
      const parents = this.findSuperIris(term, type);
      if (parents.length === 0 && isUnique(term, rootTerms)) {
        rootTerms.push(term);
      } else {
        this.findRoots(parents, rootTerms, type);
      }
    });
    return rootTerms;
  }
}
