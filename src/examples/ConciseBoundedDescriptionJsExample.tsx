import { namedNode } from '@rdfjs/data-model';
import React from 'react';
import { createComponent, renderComponent } from '..';

type Props = {};

class ConciseBoundedDescriptionJsExample extends React.Component<Props> {
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

    renderComponent(
      wrapperDom,
      'GraphContext',
      {
        // src: 'http://bag.basisregistraties.overheid.nl/bag/doc/2009061100000000/pand/0034100000086335',
        src: 'http://bag.basisregistraties.overheid.nl/bag/doc/2014012000000000/verblijfsobject/0034010000018217',
        children: (store: any) => createComponent(
          'div',
          {
            children: [
              createComponent(
                'section',
                {
                  className: 'mt-4',
                  children: createComponent(
                    'ConciseBoundedDescription',
                    {
                      store,
                      prefixes: {
                        bag: 'http://bag.basisregistraties.overheid.nl/def/bag#',
                        pdok: 'http://data.pdok.nl/def/pdok#',
                      },
                      informationResourceCollapsedRows: [
                        { predicate: namedNode('http://bag.basisregistraties.overheid.nl/def/bag#beginGeldigheid') },
                        { predicate: namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type') },
                      ],
                      resourceProps: {
                        includeProperty: (predicate: string, inverse: boolean) =>
                          !(predicate.includes('eometr') && inverse),
                      },
                    },
                  ),
                }),
            ],
          }),
      },
    );
  }

  render() {
    return (
      <div>
        <h1>ConciseBoundedDescription (without React)</h1>
        <div id="wrapper" ref={this.wrapperRef}></div>
      </div>
    );
  }
}

export default ConciseBoundedDescriptionJsExample;
