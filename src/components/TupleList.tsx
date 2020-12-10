import { Term } from 'rdf-js';
import React, { CSSProperties } from 'react';
import i18next from '../i18n';
import TupleResult, { BindingSet } from '../lib/TupleResult';
import Value, { ValueProps } from './Value';
import { sortRows } from '../utils';
import SearchInput, { SuggestProps } from './SearchInput';
import { AlphabetIndexBar } from './AlphabetIndexBar';
import { RefineSearchFilters, Filter, FilterConfig } from './RefineSearchFilters';

const DEFAULT_PAGE_SIZE = 10;

export type Column = {
  name: string;
  label?: string;
  sortable?: boolean;
  customRender?: (term: Term, bindingSet:BindingSet) => JSX.Element;
};

export type PaginationProps = boolean | {
  pageSize?: number,
};

export interface SearchListProps {
  instant: boolean;
  fields?: string[];
}

export interface AlphabetIndexBarProps {
  field: string;
}

type Props = {
  result: TupleResult;
  suggest?: SuggestProps;
  columns: Column[];
  pagination?: PaginationProps;
  search?: SearchListProps;
  filterConfig?: FilterConfig;
  alphabeticIndexBar?: AlphabetIndexBarProps;
  valueProps?: ValueProps;
  sortByColumn?: [string, boolean];
};

type State = {
  currentPage?: number;
  pageSize?: number;
  sortByColumn?: [string, boolean];
  searchString?: string;
  filterByFirstLetter: boolean;
  activeFilters: Filter[]
};

class TupleList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentPage: props.pagination ? 1 : undefined,
      pageSize: this.getPageSize(),
      sortByColumn: props.sortByColumn,
      filterByFirstLetter: false,
      activeFilters: [],
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

  filterResults = () => {
    const { result, search, alphabeticIndexBar } = this.props;
    const { searchString, filterByFirstLetter } = this.state;

    const items = result.getBindingSets();
    const filtered: BindingSet[] = [];

    /* Determine on which fields we are searching */
    const names = filterByFirstLetter && [alphabeticIndexBar!.field]
        || search?.fields || result.getBindingNames();

    /* filter bindingsets based containing search string */
    const filterBindingSetBySearchString = (value: string) => {
      return !filterByFirstLetter && value.includes(searchString!.toLowerCase());
    };

    /* filter bindingsets based on first letter when filter search is initiated by AlphabeticIndexBar */
    const filterBindingSetByFirstLetter = (value: string) => {
      if (filterByFirstLetter) {
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
          if (!filtered.includes(b) && b[name] && b[name].value &&
              (filterBindingSetByFirstLetter(b[name].value.toLowerCase())
                  || filterBindingSetBySearchString(b[name].value.toLowerCase()))) {
            filtered.push(b);
          }
        });
      });
      return filtered;
    }
    return items;
  }

  /* handle callback from AlphabeticIndexBar, set filterByFirstLetter to true */
  handleLetterBarFilter(filter: string) {
    this.setState({ filterByFirstLetter: true, searchString: filter });
  }

  /* handle callback from SearchInput */
  handleSearchFilter(filter: string) {
    this.setState({ searchString: filter, currentPage: filter ? this.state.currentPage : 1,
      filterByFirstLetter: false});
  }

  /* handle callback on selected filters */
  handleFilterSelected(filters: Filter[]) {
    this.setState({ activeFilters: filters });
  }

  getBindingSets = () => {
    const { result, pagination, filterConfig } = this.props;
    const { sortByColumn, currentPage, pageSize, searchString, activeFilters, filterByFirstLetter } = this.state;

    let items = result.getBindingSets();

    if (sortByColumn !== undefined) {
      const [sortColumn, sortAscending] = sortByColumn;
      items.sort((a, b) => sortRows(a, b, sortAscending, sortColumn));
    }

    if (searchString) {
      items = this.filterResults();

      // @ts-ignore
      if (!filterByFirstLetter && filterConfig?.RELATED && activeFilters.includes(Filter[Filter.RELATED])) {
        items = this.addRelatedItems(items, result.getBindingSets());
      }
    }

    if (pagination) {
      const offset = (currentPage! - 1) * pageSize!;
      return items.slice(offset, offset + pageSize!);
    }

    return items;
  }

  addRelatedItems(items:BindingSet[], all:BindingSet[]):BindingSet[] {
    const { filterConfig } = this.props;

    const relatedFields = filterConfig!.RELATED!.relatedFields;
    const referenceField = filterConfig!.RELATED!.referenceField;

    items.forEach((item, index) => {
      Object.keys(item).forEach((key) => {
        if (relatedFields.includes(key)) {
          const subject:string = item[key].value;
          const related = all.find(i => subject.includes(i[referenceField].value));
          if (related && !items.includes(related)) {
            items.splice(index + 1, 0, related);
          }
        }
      });
    });

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

    const length = this.props.search ? this.filterResults().length : this.props.result.getBindingSets().length;
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

  renderCustomSearchFilters = () => {
    return this.props.search && this.props.filterConfig && (<div style={{ paddingBottom: '15px' }}>
      <RefineSearchFilters
          availableFilters={Object.keys(this.props.filterConfig).map(s => s as unknown as Filter)}
          selected={this.handleFilterSelected.bind(this)}/>
    </div>);
  }

  renderSearchInput = () => {
    return this.props.search && (
        <div style={{ paddingBottom: '15px' }}>
          <SearchInput onInputChange={this.handleSearchFilter.bind(this)}
                       instantSearch={this.props.search.instant} suggest={this.props.suggest}/>
        </div>
    );
  }

  renderAlphabeticIndexBarFilter = () => {
    return this.props.alphabeticIndexBar && (
        <div style={{ paddingBottom: '15px' }}>
          <AlphabetIndexBar active={this.state.filterByFirstLetter}
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
        {this.renderCustomSearchFilters()}
        {this.renderSearchInput()}
        {this.renderAlphabeticIndexBarFilter()}
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
                        ? column.customRender(bindingSet[column.name], bindingSet)
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
