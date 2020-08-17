import React, { Component } from 'react';
import i18next from '../i18n';

interface Props {
  endpoint: string;
  queryParam?: string;
  searchDelay?: number;
  onInputChange: (value: string) => void;
}

interface State {
  activeSuggestion: number;
  suggestions: string[];
  showSuggestions: boolean;
  currentValue: string;
  loading: boolean;
  controller: AbortController | null;
}

class SearchInputWithSuggestions extends Component<Props, State> {
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

        /* cancel previous request */
    if (this.state.controller) {
      this.state.controller.abort();
    }

    this.setState({
      loading: true, controller: abortController,
    });

        /* wait to initialize request */
    return setTimeout(() => fetch(`${this.props.endpoint}?${this.props.queryParam || 'zoekTerm'}=${currentValue}`, {
      signal: abortController.signal,
    })
                .then(response => response.json())
                .then(suggestions =>  this.setState({
                  suggestions: suggestions._embedded.suggesties,
                  activeSuggestion: 0,
                  showSuggestions: true,
                  loading: false,
                }))
                .catch(() => this.setState({
                  showSuggestions: true,
                  loading: false,
                }))
            ,         this.props.searchDelay || 500);
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;

    if (currentValue.length > 2) {
      e.persist();

      this.getSuggestions(currentValue);

      this.setState({
        currentValue,
        suggestions: [],
        showSuggestions: true,
      });
    } else {
      this.setState({
        currentValue,
        suggestions: [],
        activeSuggestion: 0,
        showSuggestions: false,
      });
    }
  }

  onClick = (e: React.MouseEvent<HTMLLIElement>) => {
    this.setState({
      activeSuggestion: 0,
      suggestions: [],
      showSuggestions: false,
      currentValue: e.currentTarget.textContent!,
    });
  }

  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
                    <ul className={'suggestions'}>
                        {suggestions.map((suggestion, index) => {
                          let className = '';

                          if (index === activeSuggestion) {
                            className = 'suggestion-active';
                          }

                          return (
                                <li
                                    className={className}
                                    key={suggestion}
                                    onClick={this.onClick}
                                >
                                    {suggestion}
                                </li>
                          );
                        })}
                    </ul>
                );
      } else if (loading) {
        suggestionsListComponent = (
                    <div className={'loading-suggestions'}>
                        <em>{i18next.t('loadSuggestions')}</em>
                    </div>
                );
      } else {
        suggestionsListComponent = (
                    <div className={'no-suggestions'}>
                        <em>{i18next.t('noSuggestions')}</em>
                    </div>
                );
      }
    }

    return (
            <form onSubmit={this.handleSubmit}>
                <div className="input-group">
                    <input
                        type="text"
                        name="q"
                        autoComplete="off"
                        className="form-control"
                        placeholder={i18next.t('searchPlaceholder')}
                        onChange={this.onChange}
                        onKeyDown={this.onKeyDown}
                        value={currentValue || ''}
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

export default SearchInputWithSuggestions;
