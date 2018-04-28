import { NamedNode, BlankNode, DefaultGraph } from '../term';
import Quad from '../Quad';

export interface GraphState {
  readonly quads: Quad[];
  readonly loading: boolean;
}

export interface GraphAction {
  readonly type: string;
  readonly payload: any;
}

export interface GraphSource {
  url: string;
  graph?: NamedNode | BlankNode | DefaultGraph;
}
