import React from 'react';
import TupleContext from './TupleContext';
import { Column } from './TupleList';
import { GraphContext } from '..';

type Props = {
  endpoint: string,
  children: (data: any) => JSX.Element,
  columns?: Column[],
};

type State = {
  searchTerm: string,
  searching: boolean,
};

class Search extends React.Component<Props, State> {

  tuple: boolean = false;

  constructor(props: Props) {
    super(props);
    if (this.props.columns) {
      this.tuple = true;
    }
    this.state = {
      searching: false,
      searchTerm: '',
    };
  }

  onClick = () => {
    this.setState({ searching:true });
  }

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  }

  onChange = (e: any) => {
    this.setState({ searchTerm: e.target.value });
  }

  render() {
    return (
      <div id="Search">
        <form onSubmit={this.handleSubmit} >
        <input type="text" name="Search" value={this.state.searchTerm} onChange={this.onChange}/>
        <input type="submit" value="Submit" onClick={this.onClick} />
        </form>
        {this.state.searching ?
          (this.tuple ?
            <TupleContext src={this.props.endpoint + '?term=' + this.state.searchTerm} >
            {result => (
              this.props.children(result)
            )}
          </TupleContext> :
          <GraphContext src={this.props.endpoint + '?term=' + this.state.searchTerm}>
          {store => (
            this.props.children(store)
          )}
        </GraphContext>) :
          ''}
    </div>
    );
  }
}

export default Search;
