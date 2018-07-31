import './polyfills';
import { GraphConsumer, GraphContextProps, GraphProvider } from './containers/GraphContext';
import Label from './containers/Label';
import Resource from './containers/Resource';
import Vocabulary from './containers/Vocabulary';
import renderComponent from './renderComponent';

type ComponentMap = {
  [name: string]: any;
};

const components: ComponentMap = {
  GraphConsumer,
  GraphProvider,
  Label,
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
  GraphConsumer,
  GraphContextProps,
  GraphProvider,
  Label,
  Resource,
  Vocabulary,
  renderComponent,
  getComponent,
};
