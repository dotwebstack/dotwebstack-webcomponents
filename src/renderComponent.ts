import React from 'react';
import ReactDOM from 'react-dom';
import { getComponent } from './index';

type ComponentProps = {
  [key: string]: any;
};

const renderComponent = (container: HTMLElement, name: string, props?: ComponentProps) => {
  const component = getComponent(name);
  const element = React.createElement(component, props);
  ReactDOM.render(element, container);
};

export default renderComponent;
