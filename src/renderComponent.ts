import React from 'react';
import ReactDOM from 'react-dom';
import { getComponent } from './index';
import log from 'loglevel';

type ComponentProps = {
  [key: string]: any;
};

const renderComponent = (container: HTMLElement | null, name: string, props?: ComponentProps) => {
  if (!container) {
    log.error('HTML element not found');
  } else {
    const component = getComponent(name);
    const element = React.createElement(component, props);
    ReactDOM.render(element, container);
  }
};

export default renderComponent;
