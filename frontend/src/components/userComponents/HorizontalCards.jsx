import React, { useState } from "react";
import { Card, Button, Container, Dropdown } from "react-bootstrap";
import Search from "./Search";
import { useNavigate } from "react-router-dom";

function HorizontalCards({ movies }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const navigate = useNavigate()

  const handleSort = (criteria) => {
    setSortOrder(criteria);
  };

  const sortMovies = (movies) => {
    switch (sortOrder) {
      case "A-Z":
        return movies.sort((a, b) => a.name.localeCompare(b.name));
      case "Z-A":
        return movies.sort((a, b) => b.name.localeCompare(a.name));
      case "new":
        return movies.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "old":
        return movies.sort((a, b) => new Date(a.date) - new Date(b.date));
      default:
        return movies;
    }
  };

  const filteredShows = sortMovies(
    movies.filter(
      (show) =>
        show.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.language
          .join(", ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        show.cast.join(", ").toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.categories
          .join(", ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
  );

  const movieDetails = (id) => {
    navigate(`/movie/${id}`);
  };

  return (
    <>
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Dropdown className="mb-3">
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
          Filter
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleSort("A-Z")}>A-Z</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSort("Z-A")}>Z-A</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSort("new")}>
            Newest First
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSort("old")}>
            Oldest First
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

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
                <Button variant="dark" onClick={() => movieDetails(show._id)}>
                  Book Now
                </Button>
              </Card.Body>
            </Card>
          ))
        )}
      </Container>
    </>
  );
}

export default HorizontalCards;
