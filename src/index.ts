import './polyfills';
import ConceptList from './containers/ConceptList';
import GraphContext from './containers/GraphContext';
import Resource from './components/Resource';
import Vocabulary from './containers/Vocabulary';

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
  ConceptList,
  GraphContext,
  Resource,
  Vocabulary,
};
