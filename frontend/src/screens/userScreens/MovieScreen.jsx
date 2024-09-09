import React from "react";
import HorizontalCards from "../../components/userComponents/HorizontalCards.jsx";
import { Container } from "react-bootstrap";
import Loader from "../../components/userComponents/Loader.jsx";
import { useGetAllmoviesQuery } from "../../slice/userSlice/userApiSlice.js";
import { toast } from "react-toastify";

function MovieScreen() {
  const {
    data: movies = [],
    isLoading,
    error,
    refetch,
  } = useGetAllmoviesQuery();

  return (
    <>
      <Container>
        <h1 className="text-center mt-4 fw-bold">Movies</h1>
        {isLoading ? (
          <Loader />
        ) : error ? (
          toast.error(error.message)
        ) : (
          <>
            <HorizontalCards movies={movies} refetch={refetch} />
          </>
        )}
      </Container>
    </>
  );
}

export default MovieScreen;
