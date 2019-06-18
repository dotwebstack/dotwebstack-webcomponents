import React from 'react';
import { createComponent, renderComponent } from '..';

type Props = {};

class TupleListJsExample extends React.Component<Props> {
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
      'TupleContext',
      {
        src: 'https://data.pdok.nl/ld/dws/v1/doc/begrippen',
        children: (result: any) => createComponent('TupleList', {
          result,
          pagination: true,
          sortByColumn: ['label', true],
          columns : [
            {
              name: 'label',
              label: 'Label',
              sortable: true,
            },
            {
              name: 'begrip',
              label: 'Begrip',
              sortable: true,
            },
            {
              name: 'definition',
              label: 'Definitie',
              sortable: true,
            },
          ],
        }),
      },
    );
  }

  render() {
    return (
      <div>
        <h1>TupleList (without React)</h1>
        <div id="wrapper" ref={this.wrapperRef}></div>
      </div>
    );
  }
}

export default TupleListJsExample;
