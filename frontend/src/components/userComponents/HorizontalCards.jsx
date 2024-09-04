import React, { useState } from "react";
import { Card, Button, Container } from "react-bootstrap";
import Search from "./Search";

function HorizontalCards({ shows }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredShows = shows.filter(show =>
    show.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Container className="my-3">
        {filteredShows.length === 0 ? (
          <p className="text-center">No items found</p>
        ) : (
          filteredShows.map((show, index) => (
            <Card
              key={index}
              style={{ display: "flex", flexDirection: "row", height: "250px" }}
              className="my-3 shadow"
            >
              <Card.Img
                variant="left"
                src={`http://localhost:5000/moviePoster/${show.poster}`}
                style={{ width: "150px", height: "100%", objectFit: "cover" }}
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
          ))
        )}
      </Container>
    </>
  );
}

export default HorizontalCards;
