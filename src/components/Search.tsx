import React from 'react';
import { Column } from './TupleList';
import Store from '../lib/Store';
import { TupleResult } from '../lib/TupleResult';

type Props = {
  endpoint: string,
  children: (data: any) => JSX.Element,
  columns?: Column[],
};

type State = {
  searchTerm: string,
  searching: boolean,
};

abstract class Search extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
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
    </div>
    );
  }
}

export const search = (endpoint: string, context: (endpoint: string) => Promise<Store | TupleResult>,
                       children: (data: any) => JSX.Element) => {

  let searchURL = endpoint;

  const onChange = (e: any) => {
    searchURL = endpoint + e.target.value;
  };

  return (
  <div id="Search">
    <form>
    <input type="text" name="Search" onChange={onChange}/>
    <input type="submit" value="Submit"/>
    {context(searchURL).then((resultData: any) => {
      children(resultData);
    })}
    </form>
  </div>);
};

export default Search;
