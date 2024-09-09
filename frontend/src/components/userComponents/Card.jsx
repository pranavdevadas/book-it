import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";


function UserCard({ movies }) {
  const navigate = useNavigate()

  const movieDetails = (id) => {
    navigate(`/movie/${id}`)
  }
  return (
    <>
      <h1 className="mt-4 text-center fw-bold">Trending Movies</h1>
      <div className="container mt-5">
        <div className="row">
          {movies.map((movie, index) => (
            <div key={index} className="col-md-4 mb-4 ">
              <Card style={{ width: "75%", height: "100%" }} className="shadow">
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000/moviePoster/${movie.poster}`}
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
                  <Button variant="dark" onClick={() => movieDetails(movie._id)} >Book Now</Button>
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
