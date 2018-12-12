import React from 'react';
import ReactDOM from 'react-dom';
import log from 'loglevel';

type Props = {
  [key: string]: any;
};

const renderComponent = (container: HTMLElement | null, component: React.ComponentType<any>, props?: Props) => {
  if (!container) {
    log.error('HTML element not found');
  } else {
    const element = React.createElement(component, props);
    ReactDOM.render(element, container);
  }
};

export default renderComponent;
