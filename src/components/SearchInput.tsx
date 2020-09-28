import React from 'react';
import i18next from '../i18n';
import TupleResult, { BindingSet } from '../lib/TupleResult';

export type SuggestProps = {
  endpoint?: string
  suggestions?: [TupleResult, string];
  queryParam?: string;
  delay?: number;
};

type Props = {
  onInputChange: (value: string) => void;
  suggest?: SuggestProps;
  instantSearch?: boolean;
};

type State = {
  activeSuggestion: number;
  suggestions: string[];
  showSuggestions: boolean;
  currentValue: string;
  loading: boolean;
  controller: AbortController | null;
};

class SearchInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      activeSuggestion: 0,
      suggestions: [],
      showSuggestions: false,
      currentValue: '',
      loading: false,
      controller: null,
    };
  }

  getSuggestions = (currentValue: string): any => {
    const abortController = new AbortController();
    const { endpoint, queryParam, delay, suggestions } = this.props.suggest!;

    if (endpoint) {
      /* cancel previous request */
      if (this.state.controller) {
        this.state.controller.abort();
      }

      this.setState({
        loading: true, controller: abortController,
      });

      /* wait to initialize request */
      return setTimeout(() => fetch(`${endpoint}?${queryParam || 'zoekTerm'}=${currentValue}`, {
        signal: abortController.signal,
      })
              .then(response => response.json())
              .then(suggestions => this.setState({
                suggestions: suggestions._embedded.suggesties,
                activeSuggestion: 0,
                showSuggestions: true,
                loading: false,
              }),
              )
              .catch((e: Error) => {
                /* Don't update state on abortion of request */
                if (e.name !== 'AbortError') {
                  this.setState({
                    showSuggestions: true,
                    loading: false,
                  });
                }
              })
          ,             delay || 500);
    }

    if (suggestions) {
      this.setState({
        suggestions: suggestions[0].getBindingSets().map((b:BindingSet) => b[suggestions[1]].value)
            .filter((suggestion: string) => suggestion.toLowerCase().includes(currentValue.toLowerCase())),
        activeSuggestion: 0,
        showSuggestions: true,
        loading:false,
      });
    }

  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;

    if (this.props.suggest) {
      if (currentValue.length > 2) {
        e.persist();

        this.getSuggestions(currentValue);

        this.setState({
          currentValue,
          showSuggestions: true,
        });
      } else {
        this.setState({
          currentValue,
          activeSuggestion: 0,
          showSuggestions: false,
        });
      }
    } else {
      this.setState({ currentValue });
    }

    if (this.props.instantSearch) {
      this.props.onInputChange(currentValue);
    }
  }

  onClick = (e: React.MouseEvent<any>) => {
    this.setState({
      activeSuggestion: 0,
      suggestions: [],
      showSuggestions: false,
      currentValue: e.currentTarget.textContent!,
    });
    this.props.onInputChange(e.currentTarget.textContent!);
  }

  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (this.props.suggest) {
      const { activeSuggestion, suggestions } = this.state;

      if (e.key === 'Enter') {
        this.setState({
          activeSuggestion: 0,
          showSuggestions: false,
          currentValue: suggestions[activeSuggestion],
        });
      } else if (e.key === 'ArrowUp') {
        if (activeSuggestion === 0) {
          return;
        }

        this.setState({ activeSuggestion: activeSuggestion - 1 });
      } else if (e.key === 'ArrowDown') {
        if (activeSuggestion - 1 === suggestions.length) {
          return;
        }
        this.setState({ activeSuggestion: activeSuggestion + 1 });
      }
    } else {
      return e;
    }
  }

  onHover(active: boolean, index: number) {
    this.setState({ activeSuggestion: active ? index : 0 });
  }

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    this.props.onInputChange(this.state.currentValue);
  }

  render() {
    let suggestionsListComponent;

    const { showSuggestions, suggestions, currentValue, loading, activeSuggestion } = this.state;

    if (showSuggestions && currentValue) {
      if (suggestions.length) {
        suggestionsListComponent = (
            <ul id={'suggestions-list'} className={'border border-secondary mt-4 pl-0'} style={{ cursor: 'pointer' }}>
              {suggestions.map((suggestion, index) => {
                return <Suggestion onHover={ (active) => { this.onHover(active, index); }} key={index}
                    suggestion={suggestion} onClick={this.onClick} active={activeSuggestion === index}/>;
              })}
            </ul>
        );
      } else if (loading) {
        suggestionsListComponent = (
            <div id={'loading-suggestions'} className={'p-1'}>
              <em>{i18next.t('loadSuggestions')}</em>
            </div>
        );
      } else {
        suggestionsListComponent = (
            <div id={'no-suggestions'} className={'p-1'}>
              <em>{i18next.t('noSuggestions')}</em>
            </div>
        );
      }
    }

    return (
      <form onSubmit={this.handleSubmit} >
        <div className="input-group">
          <input
            type="search"
            name="q"
            autoComplete="off"
            className="form-control"
            placeholder={i18next.t('searchPlaceholder')}
            value={currentValue || ''}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            onClick={this.onClick}
          />
          <span className="input-group-btn">
            <button type="submit" className="btn btn-primary pull-left">
              {i18next.t('search')}
            </button>
          </span>
        </div>
        {suggestionsListComponent}
      </form>
    );
  }
}

interface SuggestionProps {
  active: boolean;
  onClick: (event: React.MouseEvent<HTMLLIElement>) => void;
  onHover: (hover: boolean) => void;
  suggestion: string;
}
const Suggestion:React.FunctionComponent<SuggestionProps> = ({ active, suggestion, onClick, onHover }) => {
  return (
      <li
          onMouseOver={() => onHover(true)}
          onMouseOut={() => onHover(false)}
          style={{
            listStyle: 'none',
            background: `${active ? '#c6c6c6' : ''}`,
          }}
          className={'p-1'}
          key={suggestion}
          onClick={onClick}
      >
        {suggestion}
      </li>
  );
};

export default SearchInput;
