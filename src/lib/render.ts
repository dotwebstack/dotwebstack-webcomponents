import { UpdateFunction, render, Descriptor } from 'hybrids';
import { render as renderLit } from 'lit-html';

export default <E extends HTMLElement>(fn: any): Descriptor<E> => render(
  (host: E) => {
    const template = fn(host);

    const updateFn: UpdateFunction<E> = (_host, target) => {
      renderLit(template, target as Element);
    };

    return updateFn;
  },
  { shadowRoot: false },
);

export { html, svg } from 'lit-html';
