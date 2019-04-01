import React from 'react';

const Search = ({ value, onSearchChange, children, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <input type="text" onChange={onSearchChange} value={value} />
      <button type="submit"> {children} </button>
    </form>
  );
};

export default Search;
