import './polyfills';
import React from 'react';
import ReactDOM from 'react-dom';
import ConceptList from './components/ConceptList';
import GraphContext, { graphContext } from './components/GraphContext';
import Store from './lib/Store';
import Resource from './components/Resource';
import Vocabulary from './components/Vocabulary';
import PropertyList from './components/PropertyList';
import ClassList from './components/ClassList';
import ClassTree from './components/ClassTree';
import PropertyTree from './components/PropertyTree';
import TupleList, { PaginationProps } from './components/TupleList';
import TupleContext, { tupleContext } from './components/TupleContext';
import TupleResult from './lib/TupleResult';
import Label from './components/Label';
import TupleSearch from './components/TupleSearch';
import GraphSearch from './components/GraphSearch';
import Value, { ValueProps } from './components/Value';

export const createComponent = (component: React.ComponentType<any> | string, props?: any) =>
  React.createElement(resolveComponent(component), props);

export const renderComponent = (container: HTMLElement, component: React.ComponentType<any> | string, props?: any) =>
  ReactDOM.render(createComponent(component, props), container);

const resolveComponent = (component: React.ComponentType<any> | string) : React.ComponentType<any> | string => {
  if (typeof component === 'string') {
    const entry = componentRegistry.get(component);
    if (entry) {
      return entry;
    }
  }
  return component;
};

// Make components resolveable by string reference
const componentRegistry = new Map<string, React.ComponentType<any>>();
componentRegistry.set('Label', Label);
componentRegistry.set('Value', Value);
componentRegistry.set('ConceptList', ConceptList);
componentRegistry.set('GraphContext', GraphContext);
componentRegistry.set('GraphSearch', GraphContext);
componentRegistry.set('Resource', Resource);
componentRegistry.set('Vocabulary', Vocabulary);
componentRegistry.set('ClassTree', ClassTree);
componentRegistry.set('PropertyTree', PropertyTree);
componentRegistry.set('PropertyList', PropertyList);
componentRegistry.set('ClassList', ClassList);
componentRegistry.set('TupleContext', TupleContext);
componentRegistry.set('TupleList', TupleList);
componentRegistry.set('TupleSearch', TupleSearch);

export {
  Label,
  Value,
  ValueProps,
  graphContext,
  ConceptList,
  GraphContext,
  GraphSearch,
  Store,
  Resource,
  Vocabulary,
  ClassTree,
  PropertyTree,
  PropertyList,
  ClassList,
  TupleContext,
  TupleResult,
  TupleList,
  PaginationProps,
  tupleContext,
  TupleSearch,
};
