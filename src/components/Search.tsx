import React from 'react';
import { Column } from './TupleList';

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

export default Search;
