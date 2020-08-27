import React from 'react';
import querystring from 'querystring';
import TupleContext from './TupleContext';
import TupleResult from '../lib/TupleResult';
import SearchInput, { SuggestProps } from './SearchInput';

type Props = {
  endpoint: string;
  queryParam?: string;
  suggest?: SuggestProps;
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
    return (
      <div>
        <SearchInput onInputChange={this.handleInputChange} suggest={this.props.suggest} />
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
