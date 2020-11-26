import { Term } from 'rdf-js';
import React, { CSSProperties } from 'react';
import i18next from '../i18n';
import TupleResult, { BindingSet } from '../lib/TupleResult';
import Value, { ValueProps } from './Value';
import { sortRows } from '../utils';
import SearchInput, { SuggestProps } from './SearchInput';
import { LetterBarFilter } from './LetterBarFilter';

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

export interface SearchListProps {
  instant: boolean;
  fields?: string[];
}

export interface LetterBarProps {
  field: string;
}

type Props = {
  result: TupleResult;
  suggest?: SuggestProps;
  columns: Column[];
  pagination?: PaginationProps;
  search?: SearchListProps;
  letterBar?: LetterBarProps;
  valueProps?: ValueProps;
  sortByColumn?: [string, boolean];
};

type State = {
  currentPage?: number;
  pageSize?: number;
  sortByColumn?: [string, boolean];
  searchString?: string;
  filterByStartOfSearchString: boolean;
};

class TupleList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentPage: props.pagination ? 1 : undefined,
      pageSize: this.getPageSize(),
      sortByColumn: props.sortByColumn,
      filterByStartOfSearchString: false,
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

  getSearchResults = () => {
    const { result, search, letterBar } = this.props;
    const { searchString, filterByStartOfSearchString } = this.state;

    const items = result.getBindingSets();
    const filtered: BindingSet[] = [];
    const names = filterByStartOfSearchString && [letterBar!.field] || search?.fields || result.getBindingNames();

    const filterBySearchString = (value: string) => {
      return !filterByStartOfSearchString && value.includes(searchString!.toLowerCase());
    };
    const filterByFirstLetter = (value: string) => {
      if (filterByStartOfSearchString) {
        if (searchString === i18next.t('showAll')) {
          return true;
        }
        if (searchString === '0-9') {
          return !value.match(/^[A-Za-z]/);
        }
        return value.startsWith(searchString!.toLowerCase());
      }
      return false;
    };

    if (searchString) {
      items.forEach((b: BindingSet) => {
        names.forEach((name: string) => {
          if (b[name] && b[name].value &&
              (filterByFirstLetter(b[name].value.toLowerCase()) || filterBySearchString(b[name].value.toLowerCase()))
              && !filtered.includes(b)) {
            filtered.push(b);
          }
        });
      });
      return filtered;
    }
    return items;
  }

  handleLetterBarFilter(filter: string) {
    this.setState({ filterByStartOfSearchString: true, searchString: filter });
  }

  getBindingSets = () => {
    const { result, pagination } = this.props;
    const { sortByColumn, currentPage, pageSize, searchString } = this.state;

    let items = result.getBindingSets();

    if (sortByColumn !== undefined) {
      const [sortColumn, sortAscending] = sortByColumn;
      items.sort((a, b) => sortRows(a, b, sortAscending, sortColumn));
    }

    if (searchString) {
      items = this.getSearchResults();
    }

    if (pagination) {
      const offset = (currentPage! - 1) * pageSize!;
      return items.slice(offset, offset + pageSize!);
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

    const length = this.props.search ? this.getSearchResults().length : this.props.result.getBindingSets().length;
    const hasNext = length > (this.state.currentPage! * this.state.pageSize!);
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

  renderSearchInput = () => {
    return this.props.search && (
        <div style={{ paddingBottom: '15px' }}>
          <SearchInput onInputChange={searchString =>
              this.setState({ searchString, currentPage: searchString ? this.state.currentPage : 1,
                filterByStartOfSearchString: false}) }
                       instantSearch={this.props.search.instant} suggest={this.props.suggest}/>
        </div>
    );
  }

  renderLetterBarFilter = () => {
    return this.props.letterBar && (
        <div style={{ paddingBottom: '15px' }}>
          <LetterBarFilter active={this.state.filterByStartOfSearchString}
                           onSelect={this.handleLetterBarFilter.bind(this)}/>
        </div>
    );
  }

  renderSortArrow = (column: Column) => {
    const isSorted = this.state.sortByColumn !== undefined
      && column.name === this.state.sortByColumn[0];

    const isSortedAsc = isSorted
      && this.state.sortByColumn !== undefined
      && this.state.sortByColumn[1];

    const changeSort = () => this.setState({
      sortByColumn: [column.name, !isSortedAsc],
    });

    const style: CSSProperties = {
      float: 'right',
      cursor: 'pointer',
      color: isSorted ? '#000' : '#ddd',
    };

    return (
      <div onClick={changeSort} style={style}>
        {isSorted && isSortedAsc && <span>&#9650;</span>}
        {isSorted && !isSortedAsc && <span>&#9660;</span>}
        {!isSorted && <span>&#9650;&#9660;</span>}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderSearchInput()}
        {this.renderLetterBarFilter()}
        {this.renderPager()}
        <div style={{ overflowX: 'auto' }}>
          <table className="table table-bordered">
            <thead>
              <tr>
                {this.props.columns.map(column => (
                  <th key={column.name} scope="row">
                    {column.label || column.name}
                    {column.sortable && this.renderSortArrow(column)}
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
