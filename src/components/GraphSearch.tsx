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
      <div id="Search">
        <form onSubmit={this.handleSubmit} >
        <input type="text" name="Search" value={this.state.searchTerm} onChange={this.onChange}/>
        <input type="submit" value="Submit" onClick={this.onClick} />
        </form>
        {this.state.searching ?
          <GraphContext src={this.props.endpoint + this.state.searchTerm}>
          {store => (
            this.props.children(store)
          )}
        </GraphContext> :
          ''}
    </div>
    );
  }
}

const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();
};

export const graphSearch = (endpoint: string, children: (data: any) => JSX.Element) => {

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
  {graphContext(searchURL).then((resultData: any) => {
    children(resultData);
  })}
  </div>);
};

export default GraphSearch;
