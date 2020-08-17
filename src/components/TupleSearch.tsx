import React from 'react';
import querystring from 'querystring';
import TupleContext from './TupleContext';
import TupleResult from '../lib/TupleResult';
import SearchInputWithSuggestions from './SearchInputWithSuggestions';
import SearchInput from './SearchInput';

type Props = {
  endpoint: string;
  queryParam?: string;
  suggestEndpoint?: string,
  suggestQueryParam?: string,
  suggestionDelay?:number,
  defaultValue?: string;
  children: (data: TupleResult) => JSX.Element,
};

type State = {
  query?: string;
};

class TupleSearch extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      query: props.defaultValue,
    };
  }
  handleInputChange = (value: string) => {
    this.setState({
      query: value,
    });
  }

  buildUrl = () => this.props.endpoint + '?' + querystring.stringify({
    [this.props.queryParam || 'q']: this.state.query,
  })

  render() {
    const { suggestEndpoint, suggestQueryParam, suggestionDelay } = this.props;

    let searchInput;
    if (suggestEndpoint) {
      searchInput = <SearchInputWithSuggestions onInputChange={this.handleInputChange}
                                                endpoint={suggestEndpoint}
                                                queryParam={suggestQueryParam} searchDelay={suggestionDelay}/>;
    } else {
      searchInput = <SearchInput onInputChange={this.handleInputChange} />;
    }

    return (
      <div>
        {searchInput}
        {this.state.query !== undefined && (
          <div style={{ marginTop: 15 }}>
            <TupleContext src={this.buildUrl()} >
              {this.props.children}
            </TupleContext>
          </div>
        )}
      </div>
    );
  }
}

export default TupleSearch;
