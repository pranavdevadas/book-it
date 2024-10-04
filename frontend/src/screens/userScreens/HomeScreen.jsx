import React, { useEffect } from "react";
import Card from "../../components/userComponents/Card.jsx";
import { Container } from "react-bootstrap";
import Loader from "../../components/userComponents/Loader.jsx";
import Carousels from "../../components/userComponents/Carousels.jsx";
import {
  useGetAllmoviesQuery,
  useBannerDisplayQuery,
} from "../../slice/userSlice/userApiSlice.js";
import { toast } from "react-toastify";

function HomeScreen() {
  const { data: movies = [], isLoading, refetch } = useGetAllmoviesQuery();

  const {
    data: banners = [],
    isLoading: bannerLoading,
    refetch: bannerRefetch,
  } = useBannerDisplayQuery();

  if (isLoading || bannerLoading) {
    <Loader />;
  }

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
    <h1>hey</h1>
      <Carousels banner={banners} bannerRefetch={bannerRefetch} />
      <Container>
        {isLoading || bannerLoading ? (
          <Loader />
        ) : (
          <Card movies={movies} refetch={refetch} />
        )}
      </Container>
    </>
  );
}

export default HomeScreen;
