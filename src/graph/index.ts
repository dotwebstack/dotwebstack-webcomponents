import { NamedNode, BlankNode, DefaultGraph } from '../term';
import Quad from '../Quad';

export interface GraphState {
  readonly quads: Quad[];
  readonly loading: boolean;
}

export interface GraphSource {
  url: string;
  graph?: NamedNode | BlankNode | DefaultGraph;
}
