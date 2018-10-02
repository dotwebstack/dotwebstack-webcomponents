import './polyfills';
import { GraphConsumer, GraphContextProps, GraphProvider } from './containers/GraphContext';
import ConceptList from './containers/ConceptList';
import Resource from './components/Resource';
import Vocabulary from './containers/Vocabulary';

type ComponentMap = {
  [name: string]: any;
};

const components: ComponentMap = {
  ConceptList,
  GraphConsumer,
  GraphProvider,
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
  ConceptList,
  GraphConsumer,
  GraphContextProps,
  GraphProvider,
  Resource,
  Vocabulary,
  getComponent,
};
