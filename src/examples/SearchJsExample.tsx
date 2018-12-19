import React from 'react';
import { createComponent, renderComponent, TupleList, TupleResult, TupleSearch } from '..';
import { Column } from '../components/TupleList';

const columns: Column[] = [
  {
    name: 'resource_label',
    label: 'Label',
  },
  {
    name: 'resource',
    label: 'Begrip',
  },
  {
    name: 'uitleg',
    label: 'Definitie',
  },
];

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

    renderComponent(wrapperDom, TupleSearch, {
      endpoint: 'https://catalogus.kadaster.nl/concepten',
      queryParam: 'term',
      children: (result: TupleResult) => createComponent(TupleList, {
        columns,
        result,
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
