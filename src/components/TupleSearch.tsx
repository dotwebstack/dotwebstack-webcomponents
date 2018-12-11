import React from 'react';
import TupleContext from './TupleContext';
import { Column } from './TupleList';
import Search from './Search';
import { tupleContext } from '..';

type Props = {
  endpoint: string,
  children: (data: any) => JSX.Element,
  columns: Column[],
};

class TupleSearch extends Search {

  tuple: boolean = false;

  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div id="Search">
        <form onSubmit={this.handleSubmit} >
        <input type="text" name="Search" value={this.state.searchTerm} onChange={this.onChange}/>
        <input type="submit" value="Submit" onClick={this.onClick} />
        </form>
        {this.state.searching ?
            <TupleContext src={this.props.endpoint + this.state.searchTerm} >
            {result => (
              this.props.children(result)
            )}
            </TupleContext> :
          ''}
    </div>
    );
  }
}

const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();
};

export const tupleSearch = (endpoint: string, children: (data: any) => JSX.Element) => {

  let searchURL = endpoint;

  const onChange = (e: any) => {
    searchURL = endpoint + e.target.value;
  };

  return (
  <div id="Search">
  <form onSubmit={handleSubmit} >
  <input type="text" name="Search" onChange={onChange}/>
  <input type="submit" value="Submit"/>
  </form>
  {tupleContext(searchURL).then((resultData: any) => {
    children(resultData);
  })}
  </div>);
};

export default TupleSearch;
