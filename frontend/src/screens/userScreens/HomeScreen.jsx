import React, { useEffect } from "react";
import Card from "../../components/userComponents/Card.jsx";
import { Container } from "react-bootstrap";
import Loader from '../../components/userComponents/Loader.jsx'
import Carousels from "../../components/userComponents/Carousels.jsx";
import { useGetAllmoviesQuery, useBannerDisplayQuery } from "../../slice/userSlice/userApiSlice.js";
import { toast } from 'react-toastify'

function HomeScreen() {
  const {
    data: movies = [],
    isLoading,
    error,
    refetch,
  } = useGetAllmoviesQuery();

  const {
    data: banners = [],
    refetch: bannerRefetch
  } = useBannerDisplayQuery()

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
        <Carousels banner={banners} bannerRefetch={bannerRefetch} />
        {isLoading ? (
          <Loader />
        ) : error ? (
          toast.error(error.message)
        ) : (
          <Card movies={movies} refetch={refetch}  />
        )}
      </Container>
    </>
  );
}

export default HomeScreen;
