import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import MovieTable from "../../components/adminComponents/MovieTable";
import { useGetMoviesQuery } from "../../slice/adminSlice/adminApiSlice.js";
import { toast } from "react-toastify";
import Loader from "../../components/userComponents/Loader.jsx";
import SideBarAdmin from "../../components/adminComponents/SideBar.jsx";

function MovieScreen() {
  const { data: movies = [], isLoading, error, refetch } = useGetMoviesQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <div className="d-flex">
        <SideBarAdmin />
        <div className="content">
          <h1 className="text-center mb-3">Movie Managment</h1>
          <Link to="/admin/add-movie">
            <Button variant="dark" style={{ marginLeft: "932px" }}>
              Add Movie
            </Button>
          </Link>
          {isLoading ? (
            <Loader />
          ) : error ? (
            toast.error(error.message)
          ) : (
            <MovieTable movies={movies} refetch={refetch} />
          )}
        </div>
      </div>
    </>
  );
}

export default MovieScreen;
