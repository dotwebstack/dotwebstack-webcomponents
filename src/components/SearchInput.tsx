import React from 'react';
import i18next from '../i18n';

type Props = {
  onInputChange: (value: string) => void;
};

type State = {
  currentValue: string;
};

class SearchInput extends React.Component<Props, State> {
  state: State = {
    currentValue: '',
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      currentValue: event.target.value,
    });
  }

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    this.props.onInputChange(this.state.currentValue);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} >
        <div className="input-group">
          <input
            type="text"
            name="q"
            className="form-control"
            placeholder={i18next.t('searchPlaceholder')}
            value={this.state.currentValue}
            onChange={this.handleInputChange}
          />
          <span className="input-group-btn">
            <button type="submit" className="btn btn-primary pull-left">
              {i18next.t('search')}
            </button>
          </span>
        </div>
      </form>
    );
  }
}

export default SearchInput;
