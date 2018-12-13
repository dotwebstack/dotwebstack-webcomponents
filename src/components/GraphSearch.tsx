import React from 'react';
import querystring from 'querystring';
import SearchInput from './SearchInput';
import { GraphContext } from '..';
import Store from '../lib/Store';

type Props = {
  endpoint: string;
  queryParam?: string;
  children: (store: Store) => JSX.Element,
};

type State = {
  query?: string;
};

class GraphSearch extends React.Component<Props, State> {
  state: State = {};

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
        <SearchInput onInputChange={this.handleInputChange} />
        {this.state.query !== undefined && (
          <div style={{ marginTop: 15 }}>
            <GraphContext src={this.buildUrl()} >
              {this.props.children}
            </GraphContext>
          </div>
        )}
      </div>
    );
  }
}

export default GraphSearch;
