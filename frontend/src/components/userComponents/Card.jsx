import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import cardPic from "../../assets/cardSample.jpeg";

function UserCard({ shows }) {
  return (
    <>
      <h1 className="mt-4 text-center fw-bold">Trending Movies</h1>
      <div className="container mt-5">
        <div className="row">
          {shows.map((show, index) => (
            <div key={index} className="col-md-4 mb-4 ">
              <Card style={{ width: "75%", height: "100%" }} className="shadow">
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000/moviePoster/${show.poster}`}
                  className="img-fluid"
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{show.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {show.categories.join(", ")}
                  </Card.Subtitle>
                  <Card.Text>
                    Language: {show.language.join(", ")}
                    <br />
                    <br />
                    Cast: {show.cast.join(", ")}
                  </Card.Text>
                  <Button variant="dark">Book Now</Button>
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
