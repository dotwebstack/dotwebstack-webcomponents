import { Term } from 'rdf-js';
import React from 'react';
import i18next from '../i18n';
import TupleResult from '../lib/TupleResult';
import Value, { ValueProps } from './Value';
import { sortRows } from '../utils';

const DEFAULT_PAGE_SIZE = 10;

export type Column = {
  name: string;
  label?: string;
  sortable?: boolean;
  customRender?: (term?: Term) => JSX.Element;
};

export type PaginationProps = boolean | {
  pageSize?: number,
};

type Props = {
  result: TupleResult,
  columns: Column[],
  pagination?: PaginationProps,
  valueProps?: ValueProps,
  sortByColumn: [string, boolean];
};

type State = {
  currentPage?: number,
  pageSize?: number,
  sortByColumn: [string, boolean],
};

class TupleList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentPage: props.pagination ? 1 : undefined,
      pageSize: this.getPageSize(),
      sortByColumn: this.props.sortByColumn,
    };
  }

  getPageSize = () => {
    if (!this.props.pagination) {
      return undefined;
    }

    return this.props.pagination === true
      ? DEFAULT_PAGE_SIZE
      : (this.props.pagination.pageSize || DEFAULT_PAGE_SIZE);
  }

  sortOnProps = (column: Column) => {
    return () =>
      this.setState({
        sortByColumn: [column.name, !this.state.sortByColumn[1]],
      });
  }

  getBindingSets = () => {
    const items = this.props.result.getBindingSets();

    items.sort((a, b) => {
      return sortRows(a, b, this.state.sortByColumn[1], this.state.sortByColumn[0]);
    });

    if (this.props.pagination) {
      const offset = (this.state.currentPage! - 1) * this.state.pageSize!;
      return items.slice(offset, offset + this.state.pageSize!);
    }

    return items;
  }

  renderPager = () => {
    if (!this.props.pagination) {
      return null;
    }

    const hasPrevious = this.state.currentPage! > 1;
    const navigatePrevious = () => this.setState({
      currentPage: this.state.currentPage! - 1,
    });

    const hasNext = this.props.result.getBindingSets().length > (this.state.currentPage! * this.state.pageSize!);
    const navigateNext = () => this.setState({
      currentPage: this.state.currentPage! + 1,
    });

    return (
      <nav style={{ display: 'inline-block', width: '100%' }}>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!hasPrevious}
          onClick={navigatePrevious}
          style={{ float: 'left' }}
        >
          &laquo; {i18next.t('previous')}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!hasNext}
          onClick={navigateNext}
          style={{ float: 'right' }}
        >
          {i18next.t('next')} &raquo;
        </button>
      </nav>
    );
  }

  renderField = (term?: Term) => {
    if (term === undefined) {
      return (
        <span>-</span>
      );
    }

    return (
      <Value term={term} {...this.props.valueProps} />
    );
  }

  selectSortIcon(column: Column) {
    if (this.state.sortByColumn[0] === column.name) {
      if (this.state.sortByColumn[1]) {
        return '\u2bc5';
      }
      return '\u2bc6';
    }
    return '\u2bc1';
  }

  selectColor(column: Column) {
    if (column.name === this.state.sortByColumn[0]) {
      return '#000000';
    }
    return '#b1aeb0';
  }

  render() {
    return (
      <div>
        {this.renderPager()}
        <div style={{ overflowX: 'auto' }}>
          <table className="table table-bordered">
            <thead>
            <tr>
              {this.props.columns.map(column => (
                <th key={column.name} scope="row">
                  {column.label || column.name}
                  {column.sortable &&
                    <div
                      onClick={this.sortOnProps(column)}
                      style={{ color:this.selectColor(column), float: 'right', fontSize: 30 }}
                    >
                      {this.selectSortIcon(column)}
                    </div>
                  }
                </th>
              ))}
            </tr>
            </thead>
            <tbody>
            {this.getBindingSets().map((bindingSet, index) => (
              <tr key={index}>
                {this.props.columns.map(column => (
                  <td key={column.name}>
                    {column.customRender
                      ? column.customRender(bindingSet[column.name])
                      : this.renderField(bindingSet[column.name])}
                  </td>
                ))}
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default TupleList;
