import './polyfills';
import ConceptList from './components/ConceptList';
import GraphContext, { graphContext } from './components/GraphContext';
import Resource from './components/Resource';
import renderComponent from './renderComponent';
import Vocabulary from './components/Vocabulary';
import PropertyList from './components/PropertyList';
import ClassList from './components/ClassList';
import ClassTree from './components/ClassTree';
import PropertyTree from './components/PropertyTree';
import TupleList from './components/TupleList';
import TupleContext, { tupleContext } from './components/TupleContext';
import Label from './components/Label';
import TupleSearch from './components/TupleSearch';
import GraphSearch from './components/GraphSearch';

type ComponentMap = {
  [name: string]: any;
};

const components: ComponentMap = {
  ConceptList,
  GraphContext,
  GraphSearch,
  Resource,
  Vocabulary,
  PropertyList,
  ClassList,
  ClassTree,
  PropertyTree,
  TupleContext,
  TupleList,
  TupleSearch,
};

const getComponent: any = (name: string) => {
  if (!components.hasOwnProperty(name)) {
    throw new Error(`Component '${name}' not found.`);
  }

  return components[name];
};

export {
  Label,
  getComponent,
  renderComponent,
  graphContext,
  ConceptList,
  GraphContext,
  GraphSearch,
  Resource,
  Vocabulary,
  ClassTree,
  PropertyTree,
  PropertyList,
  ClassList,
  TupleContext,
  TupleList,
  tupleContext,
  TupleSearch,
};
