import React from 'react';
import { createComponent, renderComponent } from '..';
import { namedNode } from '@rdfjs/data-model';
import { Term } from 'rdf-js';

const endpoint = 'https://regelgeving.omgevingswet.overheid.nl/id/concept/AanHuisVerbondenBeroep';
const resourceIri = namedNode(
  'http://regelgeving.omgevingswet.overheid.nl/id/concept/AanHuisVerbondenBeroep',
);

type Props = {};

class ResourceJsExample extends React.Component<Props> {
  wrapperRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    const wrapperDom = this.wrapperRef.current;

    if (!wrapperDom) {
      return;
    }

    renderComponent(wrapperDom, 'GraphContext', {
      src: endpoint,
      children: (store: any) =>
        createComponent('div', {
          children: [
            createComponent('h1', {
              children: createComponent('Label', { store, resourceIri }),
            }),
            createComponent('p', null),
            createComponent('section', {
              className: 'mt-4',
              children: createComponent('Resource', {
                store,
                resourceIri,
                rows: [
                  {
                    predicate: namedNode('http://www.w3.org/2000/01/rdf-schema#isDefinedBy'),
                    label: 'Is defined by',
                  },
                  {
                    predicate: namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
                    label: 'Label',
                  },
                  {
                    predicate: namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
                    label: 'Type',
                  },
                  {
                    predicate: namedNode('http://purl.org/dc/terms/subject'),
                    label: 'Subject',
                    customRender: (terms: Term[]) => {
                      return <span>{terms.length}</span>;
                    },
                  },
                  {
                    predicate: namedNode('http://purl.org/dc/terms/extralabel'),
                    label: 'Extra label',
                  },
                  {
                    predicate: namedNode(
                      'https://nl.wikipedia.org/wiki/Uniform_resource_identifier',
                    ),
                    label: 'URI',
                    customRender: () => {
                      return <a href={resourceIri.value}>{resourceIri.value}</a>;
                    },
                  },
                ],
              }),
            }),
          ],
        }),
    });
  }

  render() {
    return (
      <div>
        <h1>Resource (without React)</h1>
        <div id="wrapper" ref={this.wrapperRef}></div>
      </div>
    );
  }
}

export default ResourceJsExample;
