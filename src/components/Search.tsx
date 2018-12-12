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
  searchURL: string,
  searching: boolean,
};

abstract class Search extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      searching: false,
      searchTerm: '',
      searchURL: this.props.endpoint,
    };
  }

  searchTerm = '';

  onClick = () => {
    this.setState({ searching:true, searchURL: this.props.endpoint + this.state.searchTerm });
  }

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  }

  onChange = (e: any) => {
    this.searchTerm = e.target.value;
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

  context(searchURL).then((resultData: any) => {
    children(resultData);
  });

  return (
  <div id="Search">
    <form>
    <input type="text" name="Search" onChange={onChange}/>
    <input type="submit" value="Submit"/>
    </form>
  </div>);
};

export default Search;
