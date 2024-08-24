import React from "react";
import Button from "react-bootstrap/Button";
import MovieTable from "../../components/adminComponents/MovieTable";

function MovieScreen() {
  return (
    <>
      <Button
        variant="dark"
        style={{ marginTop: "-1089px", marginLeft: "1089px" }}
      >
        Add Movie
      </Button>
      <MovieTable />
    </>
  );
}

export default MovieScreen;
