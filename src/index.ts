import GraphContext from './containers/GraphContext';
import TupleContext from './containers/TupleContext';
import Label from './containers/Label';
import TupleList from './containers/TupleList';
import Resource from './containers/Resource';
import Vocabulary from './containers/Vocabulary';
import DataFactory from './DataFactory';
import renderComponent from './renderComponent';

type ComponentMap = {
  [name: string]: any;
};

const components: ComponentMap = {
  GraphContext,
  TupleContext,
  Label,
  TupleList,
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
  GraphContext,
  TupleContext,
  Label,
  TupleList,
  Resource,
  Vocabulary,
  DataFactory,
  renderComponent,
  getComponent,
};
