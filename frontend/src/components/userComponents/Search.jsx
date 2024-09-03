import React from "react";

function Search() {
  return (
    <div class="input-group rounded mt-4 shadow">
      <input
        type="search"
        class="form-control rounded border-0 bg-transparent border-dark text-dark"
        placeholder="Search movies or theatres"
        aria-label="Search"
        aria-describedby="search-addon"
      />
      <span
        class="input-group-text border-0 bg-dark text-dark"
        id="search-addon"
      >
        <i class="fas fa-search text-light"></i>
      </span>
    </div>
  );
}

export default Search;
