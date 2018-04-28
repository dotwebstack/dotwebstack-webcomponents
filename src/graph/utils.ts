import Quad from '../Quad';
import { NamedNode, BlankNode } from '../term';

export const matchStatement = (
    subject?: NamedNode | BlankNode,
    predicate?: NamedNode) => (quad: Quad) =>
  (subject ? quad.subject.equals(subject) : true) &&
  (predicate ? quad.predicate.equals(predicate) : true);

export const findStatements = (
    quads: Quad[],
    subject?: NamedNode | BlankNode,
    predicate?: NamedNode) =>
  quads.filter(matchStatement(subject, predicate));

export const findSingleStatement = (
    quads: Quad[],
    subject?: NamedNode | BlankNode,
    predicate?: NamedNode) =>
  findStatements(quads, subject, predicate)[0];
