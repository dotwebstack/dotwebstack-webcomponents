import React from 'react';
import TupleContext from './TupleContext';
import Search from './Search';
import { tupleContext } from '..';

type Props = {
  endpoint: string,
  children: (data: any) => JSX.Element,
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

export const tupleSearch = (endpoint: string, children: (data: any) => JSX.Element) => {

  let searchURL = endpoint;

  const onChange = (e: any) => {
    searchURL = endpoint + e.target.value;
  };

  return (
  <div id="Search">
    <form>
      <input type="text" name="Search" onChange={onChange}/>
      <input type="submit" value="Submit"/>
    {tupleContext(searchURL).then((resultData: any) => {
      children(resultData);
    })}
    </form>
  </div>);
};

export default TupleSearch;
