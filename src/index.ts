import './polyfills';
import ConceptList from './components/ConceptList';
import GraphContext from './components/GraphContext';
import Resource from './components/Resource';
import Vocabulary from './components/Vocabulary';
import ClassTree from './components/ClassTree';
import PropertyTree from './components/PropertyTree';

type ComponentMap = {
  [name: string]: any;
};

const components: ComponentMap = {
  ConceptList,
  GraphContext,
  Resource,
  Vocabulary,
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
  getComponent,
  ConceptList,
  GraphContext,
  Resource,
  Vocabulary,
  ClassTree,
  PropertyTree,
};
