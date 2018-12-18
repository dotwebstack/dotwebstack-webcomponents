import { Term } from 'rdf-js';
import React from 'react';
import i18next from '../i18n';
import TupleResult from '../lib/TupleResult';
import Value, { ValueProps } from './Value';

const DEFAULT_PAGE_SIZE = 10;

export type Column = {
  name: string;
  label?: string;
  customRender?: (term: Term) => JSX.Element;
};

export type PaginationProps = boolean | {
  pageSize?: number,
};

type Props = {
  result: TupleResult,
  columns: Column[],
  pagination?: PaginationProps,
  valueProps?: ValueProps;
};

type State = {
  currentPage?: number,
  pageSize?: number,
};

class TupleList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentPage: props.pagination ? 1 : undefined,
      pageSize: this.getPageSize(),
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

  getBindingSets = () => {
    const items = this.props.result.getBindingSets();

    if (this.props.pagination) {
      const offset = (this.state.currentPage! - 1) * this.state.pageSize!;
      return items.slice(offset, offset + this.state.pageSize!);
    }

    return items;
  }

  renderPager () {
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

  render() {
    return (
      <div>
        {this.renderPager()}
        <div style={{ overflowX: 'auto' }}>
          <table className="table table-bordered">
            <thead>
              <tr>
                {this.props.columns.map(column => (
                  <th key={column.name} scope="row">{column.label || column.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {this.getBindingSets().map((bindingSet, index) => (
                <tr key={index}>
                  {this.props.columns.map(column => (
                    <td key={column.name}>
                      {column.customRender ? column.customRender(bindingSet[column.name]) : (
                        <Value term={bindingSet[column.name]} {...this.props.valueProps} />
                      )}
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
