import { Quad, Term } from 'rdf-js';
import { reduce } from 'ramda';

type IndexMap = {
  [termValue: string]: {
    [termValue: string]: Term[],
  },
};

export default class Store {
  private spoMap: IndexMap;
  private posMap: IndexMap;

  constructor(quads: Quad[]) {
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
}
