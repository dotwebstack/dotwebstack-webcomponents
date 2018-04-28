import PropertyTable from './components/PropertyTable';
import GraphContext from './components/GraphContext';
import GraphSource from './components/GraphSource';
import DataFactory from './DataFactory';
import renderComponent from './renderComponent';

type ComponentMap = {
  [name: string]: any;
};

const components: ComponentMap = {
  PropertyTable,
  GraphContext,
  GraphSource,
};

const getComponent: any = (name: string) => {
  if (!components.hasOwnProperty(name)) {
    throw new Error(`Component '${name}' not found.`);
  }

  return components[name];
};

export {
  PropertyTable,
  GraphContext,
  GraphSource,
  DataFactory,
  renderComponent,
  getComponent,
};
