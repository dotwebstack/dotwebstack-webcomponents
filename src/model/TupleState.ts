import { ContextState, BindingSet } from '.';

export default interface TupleState extends ContextState {
  readonly bindingSets: BindingSet[];
}
