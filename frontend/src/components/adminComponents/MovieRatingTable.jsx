import React from "react";
import Table from "react-bootstrap/Table";
import Loader from "../userComponents/Loader";

function MovieRatingTable({ topMovies = [], isLoading }) {
  return (
    <>
      <h3 className="text-center text-warning mt-4 mb-4">
        Top 5 Movies (based on Rating)
      </h3>
      <Table
        striped
        bordered
        hover
        variant="dark"
        className="rounded overflow-hidden"
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Movie</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && <Loader />}
          {topMovies.length > 0 ? (
            topMovies.map((movie, index) => (
              <tr key={movie._id}>
                <td>{index + 1}</td>
                <td>{movie._id.name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No movies found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
}

export default MovieRatingTable;
