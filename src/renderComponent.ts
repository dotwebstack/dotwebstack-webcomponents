import React from 'react';
import ReactDOM from 'react-dom';

type Props = {
  [key: string]: any;
};

const renderComponent = (container: HTMLElement, component: React.ComponentType<any>, props?: Props) => {
  const element = React.createElement(component, props);
  ReactDOM.render(element, container);
};

export default renderComponent;
