import React from 'react';
import { GraphContext, graphContext } from '..';
import Search from './Search';

type Props = {
  endpoint: string,
  children: (data: any) => JSX.Element,
};

class GraphSearch extends Search{

  tuple: boolean = false;

  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div id="Search"  className="panel">
        <form onSubmit={this.handleSubmit} >
        <input type="text" name="Search" value={this.state.searchTerm} onChange={this.onChange}/>
        <input type="submit" value="Submit" onClick={this.onClick} />
        </form>
        {this.state.searching ?
          <GraphContext src={this.state.searchURL}>
          {store => (
            this.props.children(store)
          )}
        </GraphContext> :
          ''}
    </div>
    );
  }
}

export const graphSearch = (endpoint: string, children: (data: any) => JSX.Element) => {

  let searchURL = endpoint;

  const onChange = (e: any) => {
    searchURL = endpoint + e.target.value;
  };

  graphContext(searchURL).then((resultData: any) => {
    children(resultData);
  });

  return (
    <div id="Search" className="panel">
      <form>
        <input type="text" name="Search" onChange={onChange}/>
        <input type="submit" value="Submit"/>
      </form>
  </div>);
};

export default GraphSearch;
