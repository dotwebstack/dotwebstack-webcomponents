import './polyfills';
import ConceptList from './components/ConceptList';
import GraphContext from './components/GraphContext';
import Resource from './components/Resource';
import renderComponent from './renderComponent';
import Vocabulary from './components/Vocabulary';

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
  ConceptList,
  GraphContext,
  Resource,
  Vocabulary,
};
