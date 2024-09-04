import React, { useEffect } from "react";
import Card from "../../components/userComponents/Card.jsx";
import { Container } from "react-bootstrap";
import Loader from '../../components/userComponents/Loader.jsx'
import Carousels from "../../components/userComponents/Carousels.jsx";
import { useGetShowDetailsQuery } from "../../slice/userSlice/userApiSlice.js";

function HomeScreen() {
  const {
    data: shows = [],
    isLoading,
    error,
    refetch,
  } = useGetShowDetailsQuery();

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.go(1);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <>
      <Container>
        <Carousels />
        {isLoading ? (
          <Loader />
        ) : error ? (
          toast.error(error.message)
        ) : (
          <Card shows={shows} refetch={refetch} />
        )}
      </Container>
    </>
  );
}

export default HomeScreen;
