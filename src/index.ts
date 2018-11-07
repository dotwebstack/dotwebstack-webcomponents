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
import LabelComponent from './components/Label';

type ComponentMap = {
  [name: string]: any;
};

const components: ComponentMap = {
  ConceptList,
  GraphContext,
  Resource,
  Vocabulary,
  PropertyList,
  ClassList,
  ClassTree,
  PropertyTree,
};

const getComponent: any = (name: string) => {
  if (!components.hasOwnProperty(name)) {
    throw new Error(`Component '${name}' not found.`);
  }

  return components[name];
};

export {
  LabelComponent,
  getComponent,
  renderComponent,
  graphContext,
  ConceptList,
  GraphContext,
  Resource,
  Vocabulary,
  ClassTree,
  PropertyTree,
  PropertyList,
  ClassList,
};
