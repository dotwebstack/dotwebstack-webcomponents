import { Hybrids, property } from 'hybrids';
import { templateContent } from 'lit-html/directives/template-content';
import { FastDataset } from '../lib/model';
import lit, { html } from '../lib/lit';
import load from '../lib/load';

export interface IGraph extends HTMLElement {
  src: string;
  template: string;
  store: FastDataset;
}

const Graph: Hybrids<IGraph> = {
  src: {
    ...property(''),
    observe: (host, value) => {
      load(value)
        .then((store) => {
          host.store = store;
        });
    },
  },
  template: property(''),
  store: property(undefined),
  render: lit((host: IGraph) => {
    if (host.store === undefined) {
      return html`
        <p>Loading...</p>
      `;
    }

    const templateElement = document.querySelector(host.template) as HTMLTemplateElement | null;

    if (templateElement === null) {
      throw new Error('Element not found.');
    }

    return html`${templateContent(templateElement)}`;
  }),
};

export default Graph;
