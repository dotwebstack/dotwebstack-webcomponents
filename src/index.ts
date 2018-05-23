import GraphContext from './containers/GraphContext';
import Label from './containers/Label';
import ResourceList from './containers/ResourceList';
import Resource from './containers/Resource';
import Vocabulary from './containers/Vocabulary';
import DataFactory from './DataFactory';
import renderComponent from './renderComponent';

type ComponentMap = {
  [name: string]: any;
};

const components: ComponentMap = {
  GraphContext,
  Label,
  ResourceList,
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
  ResourceList,
  Resource,
  Vocabulary,
  DataFactory,
  renderComponent,
  getComponent,
};
