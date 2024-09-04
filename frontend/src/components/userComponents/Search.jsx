import React from "react";

function Search({ searchTerm, setSearchTerm }) {
  return (
    <div className="input-group rounded mt-5 mb-5 shadow mx-auto" style={{width: '75%'}}> 
      <input
        type="search"
        className="form-control rounded border-0 bg-transparent border-dark text-dark"
        placeholder="   Search items..."
        aria-label="Search"
        aria-describedby="search-addon"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <span
        className="input-group-text border-0 bg-dark text-dark"
        id="search-addon"
      >
        <i className="fas fa-search text-light"></i>
      </span>
    </div>
  );
}

export default Search;
