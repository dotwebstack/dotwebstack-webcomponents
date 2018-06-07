import GraphContext from './containers/GraphContext';
import TupleContext from './containers/TupleContext';
import Label from './containers/Label';
import TupleList from './containers/TupleList';
import Resource from './containers/Resource';
import Vocabulary from './containers/Vocabulary';
import DataFactory from './DataFactory';
import renderComponent from './renderComponent';
import ClassList from './components/Vocabulary/ClassList';
import ListIndex from './components/Vocabulary/ListIndex';
import PropertyList from './components/Vocabulary/PropertyList';

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
  ClassList,
  ListIndex,
  PropertyList,
  Vocabulary,
  DataFactory,
  renderComponent,
  getComponent,
};
