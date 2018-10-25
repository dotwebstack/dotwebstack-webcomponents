import './polyfills';
import ConceptList from './components/ConceptList';
import Resource from './components/Resource';
import renderComponent from './renderComponent';
import Vocabulary from './components/Vocabulary';
import GraphContext, { graphContext } from './components/GraphContext';

type ComponentMap = {
  [name: string]: any;
};

const components: ComponentMap = {
  ConceptList,
  GraphContext,
  Resource,
  Vocabulary,
};

const getComponent: any = (name: string) => {
  if (!components.hasOwnProperty(name)) {
    throw new Error(`Component '${name}' not found.`);
  }

  return components[name];
};

export {
  getComponent,
  renderComponent,
  graphContext,
  ConceptList,
  GraphContext,
  Resource,
  Vocabulary,
};
