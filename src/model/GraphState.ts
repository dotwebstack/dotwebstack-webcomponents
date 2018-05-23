import { ContextState, Quad } from '.';

export default interface GraphState extends ContextState {
  readonly quads: Quad[];
}
