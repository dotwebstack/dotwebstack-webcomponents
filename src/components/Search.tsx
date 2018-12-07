import React from 'react';
import TupleContext from './TupleContext';
import TupleList, { Column } from './TupleList';

type Props = {
  endpoint: string,
  columns: Column[],
};

type State = {
  searchTerm: string,
  searching: boolean,
};

class Search extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      searching: false,
      searchTerm: '',
    };
    this.onClick = this.onClick.bind(this);
    this.renderTupleList = this.renderTupleList.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onClick() {
    this.setState({ searching:true });
  }

  renderTupleList() {
    if (this.state.searching) {
      return (<TupleContext src={this.props.endpoint + '?term=' + this.state.searchTerm} >
      {result => (
        <TupleList
          result={result}
          columns={this.props.columns}
          pageSize={10}/>
      )}
    </TupleContext>);
    }
  }

  handleSubmit(event: React.FormEvent) {
    event.preventDefault();
  }

  onChange(e: any) {
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
        <TupleContext src={this.props.endpoint + '?term=' + this.state.searchTerm} >
        {result => (
          <TupleList
            result={result}
            columns={this.props.columns}
            pageSize={10}/>
        )}
      </TupleContext> :
    ''}
    </div>
    );
  }
}

export default Search;
