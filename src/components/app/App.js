import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import Search from '../search';
import Table from '../table';
import Button from '../button';
import withLoading from '../../hoc/withLoading';
import withError from '../../hoc/withError';

import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP
} from '../../constants';

const ButtonWithLoading = withLoading(Button);
const TableWithError = withError(Table);

class App extends Component {
  _isMounted = false; //Для предотвращения записи в state когда компонент удален

  state = {
    results: null,
    searchKey: '',
    searchTerm: DEFAULT_QUERY,
    error: null,
    isLoading: false
  };

  setSearchTopStories = result => {
    const { hits, page } = result;

    this.setState(prevState => {
      const { searchKey, results } = prevState;
      const oldHits =
        results && results[searchKey] ? results[searchKey].hits : [];
      const updatedHits = [...oldHits, ...hits];
      return {
        results: { ...results, [searchKey]: { hits: updatedHits, page } },
        isLoading: false
      };
    });
  };

  componentDidMount = () => {
    this._isMounted = true;
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  onDismiss = id => {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } }
    });
  };

  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value });
  };

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });

    axios(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(
        error => this._isMounted && this.setState({ error, isLoading: false })
      );
  }

  onSearchSubmit = e => {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    e.preventDefault();
  };

  needsToSearchTopStories = searchTerm => {
    return !this.state.results[searchTerm];
  };

  render() {
    const { searchTerm, results, searchKey, error, isLoading } = this.state;

    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;

    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
            onSubmit={this.onSearchSubmit}
            value={searchTerm}
            onSearchChange={this.onSearchChange}
          >
            Поиск
          </Search>
        </div>

        <TableWithError error={error} list={list} onDismiss={this.onDismiss} />

        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            Больше историй
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

export default App;
