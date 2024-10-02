import React, { useState } from "react";
import { Card, Button, Container, Dropdown, Pagination } from "react-bootstrap";
import Search from "./Search";
import { useNavigate } from "react-router-dom";

function HorizontalCards({ movies }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

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

  const totalPages = Math.ceil(filteredShows.length / itemsPerPage);

  const currentShows = filteredShows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
          <Dropdown.Item onClick={() => handleSort("new")}>Newest - Asc</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSort("old")}>Newest - Desc</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Container className="my-3">
        {currentShows.length === 0 ? (
          <p className="text-center">No items found</p>
        ) : (
          currentShows.map((show, index) => (
            <Card
              key={index}
              style={{ display: "flex", flexDirection: "row", height: "250px" }}
              className="my-3 shadow"
            >
              <Card.Img
                variant="left"
                src={`https://bookitt.online/moviePoster/${show.poster}`}
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

        {totalPages > 1 && (
          <Pagination className="justify-content-center mt-4 pagination-dark">
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            
            {[...Array(totalPages).keys()].map((page) => (
              <Pagination.Item
                key={page + 1}
                active={currentPage === page + 1}
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last 
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        )}
      </Container>
    </>
  );
}

export default HorizontalCards;
