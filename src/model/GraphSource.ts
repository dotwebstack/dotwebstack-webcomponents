import { NamedNode, BlankNode, DefaultGraph } from '.';

export default interface GraphSource {
  readonly url: string;
  readonly graph?: NamedNode | BlankNode | DefaultGraph;
}
