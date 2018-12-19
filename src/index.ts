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

export const createComponent = (component: React.ComponentType<any>, props?: any) =>
  React.createElement(component, props);

export const renderComponent = (container: HTMLElement, component: React.ComponentType<any>, props?: any) =>
  ReactDOM.render(createComponent(component, props), container);

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
