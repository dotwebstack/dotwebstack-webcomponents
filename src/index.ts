import GraphContext from './graph/containers/GraphContext';
import Label from './graph/containers/Label';
import Model from './graph/containers/Model';
import Resource from './graph/containers/Resource';
import Vocabulary from './graph/containers/Vocabulary';
import DataFactory from './DataFactory';
import renderComponent from './renderComponent';

type ComponentMap = {
  [name: string]: any;
};

const components: ComponentMap = {
  GraphContext,
  Label,
  Model,
  Resource,
};

const getComponent: any = (name: string) => {
  if (!components.hasOwnProperty(name)) {
    throw new Error(`Component '${name}' not found.`);
  }

  return components[name];
};

export {
  GraphContext,
  Label,
  Resource,
  Vocabulary,
  DataFactory,
  renderComponent,
  getComponent,
};
