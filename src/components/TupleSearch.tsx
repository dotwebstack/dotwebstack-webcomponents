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
      <div id="Search" className="panel">
        <form onSubmit={this.handleSubmit} >
        <input type="text" name="Search" value={this.state.searchTerm} onChange={this.onChange}/>
        <input type="submit" value="Submit" onClick={this.onClick} />
        </form>
        {this.state.searching ?
            <TupleContext src={this.state.searchURL} >
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

  tupleContext(searchURL).then((resultData: any) => {
    children(resultData);
  });

  return (
  <div id="Search" className="panel">
    <form>
      <input type="text" name="Search" onChange={onChange}/>
      <input type="submit" value="Submit"/>
    </form>}
  </div>);
};

export default TupleSearch;
