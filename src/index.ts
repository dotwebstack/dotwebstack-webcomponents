import GraphContext from './components/GraphContext';
import Label from './components/Label';
import PropertyTable from './components/PropertyTable';
import DataFactory from './DataFactory';
import renderComponent from './renderComponent';

type ComponentMap = {
  [name: string]: any;
};

const components: ComponentMap = {
  GraphContext,
  Label,
  PropertyTable,
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
  PropertyTable,
  DataFactory,
  renderComponent,
  getComponent,
};
