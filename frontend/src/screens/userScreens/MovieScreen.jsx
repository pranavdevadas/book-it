import React from "react";
import HorizontalCards from "../../components/userComponents/HorizontalCards.jsx";
import { Container } from "react-bootstrap";
import Search from "../../components/userComponents/Search.jsx";
import Loader from "../../components/userComponents/Loader.jsx";
import { useGetShowDetailsQuery } from "../../slice/userSlice/userApiSlice.js";

function MovieScreen() {
  const {
    data: shows = [],
    isLoading,
    error,
    refetch,
  } = useGetShowDetailsQuery();

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
          <HorizontalCards shows={shows} refetch={refetch} />
          </>
        )}
      </Container>
    </>
  );
}

export default MovieScreen;
