import React from 'react';
import { createComponent, renderComponent } from '..';

type Props = {};

class SearchJsExample extends React.Component<Props> {
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

    renderComponent(wrapperDom, 'TupleSearch', {
      endpoint: 'https://stelselcatalogus.omgevingswet.overheid.nl/concepten',
      queryParam: 'term',
      children: (result: any) => createComponent('TupleList', {
        result,
        pagination: true,
        sortByColumn: ['label', true],
        columns: [
          {
            name: 'resource_label',
            label: 'Label',
            sortable: true,
          },
          {
            name: 'resource',
            label: 'Begrip',
            sortable: true,
          },
          {
            name: 'uitleg',
            label: 'Definitie',
            sortable: true,
          },
        ],
      }),
    });
  }

  render() {
    return (
      <div>
        <h1>Search (without React)</h1>
        <div id="wrapper" ref={this.wrapperRef}></div>
      </div>
    );
  }
}

export default SearchJsExample;
