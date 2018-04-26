import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { getComponent } from './index';

type ComponentProps = {
  [key: string]: any;
};

type ComponentConfiguration = {
  name: string;
  props?: ComponentProps;
  children?: ComponentConfiguration[];
};

const createElement: any = (
    name: string,
    props?: ComponentProps,
    children?: ComponentConfiguration[]) => {
  const component = getComponent(name);

  const childComponents = children ?
    children.map(child => createElement(child.name, child.props, child.children)) : [];

  return React.createElement(component, props, ...childComponents);
};

const renderComponent = (component: ComponentConfiguration, container: HTMLElement) => {
  const element = createElement(component.name, component.props, component.children);
  ReactDOM.render(element, container);
};

export default renderComponent;
