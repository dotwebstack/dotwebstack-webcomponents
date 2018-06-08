import { NamedNode, BlankNode, Literal } from '.';

export default interface BindingSet {
  [key: string]: NamedNode | BlankNode | Literal;
}
