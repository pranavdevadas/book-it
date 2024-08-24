import React, {useEffect} from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import MovieTable from "../../components/adminComponents/MovieTable";
import { useGetMoviesQuery } from "../../slice/adminSlice/adminApiSlice.js";
import { toast } from "react-toastify";
import Loader from "../../components/userComponents/Loader.jsx";

function MovieScreen() {
  const { data: movies = [], isLoading, error, refetch } = useGetMoviesQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <Link to="/admin/add-movie">
        <Button
          variant="dark"
          style={{ marginTop: "-1089px", marginLeft: "1089px" }}
        >
          Add Movie
        </Button>
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        toast.error(error.message)
      ) : (
        <MovieTable movies={ movies } refetch ={ refetch }/>
      )}
    </>
  );
}

export default MovieScreen;
