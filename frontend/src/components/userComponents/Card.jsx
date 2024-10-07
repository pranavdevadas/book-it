import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { FaRegBookmark } from "react-icons/fa6";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import {
  useAddSavedMoviesMutation,
  useGetSavedMoviesQuery,
} from "../../slice/userSlice/userApiSlice";
import { toast } from "react-toastify";

function UserCard({ movies }) {
  const navigate = useNavigate();
  const [addSavedMovie] = useAddSavedMoviesMutation();
  const { refetch: refetchSavedMovies } = useGetSavedMoviesQuery();

  const handleSaveMovie = async (movieId) => {
    try {
      const response = await addSavedMovie(movieId).unwrap();
      toast.success("Movie saved successfully!");
      refetchSavedMovies();
    } catch (error) {
      console.error("Error saving movie:", error);
      toast.error(
        error?.data?.message || "Error: This movie is already saved."
      );
    }
  };

  const movieDetails = (id) => {
    navigate(`/movie/${id}`);
  };

  return (
    <>
      <h1 className="mt-4 text-center fw-bold">Trending Movies</h1>
      <div className="container mt-5">
        <div className="row">
          {movies.map((movie, index) => (
            <div key={index} className="col-md-4 mb-4 ">
              <Card
                style={{
                  width: window.innerWidth <= 375 ? "114%" : "75%",
                  height: "100%",
                  margin: '-24px',
                  padding: 0
                }}
                className="shadow"
              >
                <Card.Img
                  variant="top"
                  src={`https://bookitt.online/moviePoster/${movie.poster}`}
                  className="img-fluid"
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{movie.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {movie.categories.join(", ")}
                  </Card.Subtitle>
                  <Card.Text>
                    Language: {movie.language.join(", ")}
                    <br />
                    <br />
                    Cast: {movie.cast.join(", ")}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <Button
                      variant="dark"
                      onClick={() => movieDetails(movie._id)}
                    >
                      Book Now
                    </Button>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Save the movie</Tooltip>}
                    >
                      <span>
                        <FaRegBookmark
                          className="ms-3"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSaveMovie(movie._id)}
                        />
                      </span>
                    </OverlayTrigger>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default UserCard;
