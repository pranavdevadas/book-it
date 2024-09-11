import React from "react";
import Table from "react-bootstrap/Table";
import Search from "../userComponents/Search";
import { useState } from "react";
import { Container, Pagination } from "react-bootstrap";

function TheatreTable({ theatres }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredItems = theatres.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedTheatres = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Table
        striped
        bordered
        hover
        variant="dark"
        className="rounded overflow-hidden mt-4"
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Theatre</th>
            <th>City</th>
            <th>Theatre Owner</th>
            <th>No. of Screens</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTheatres.length > 0 ? (
            paginatedTheatres.map((theatre, index) => (
              <tr key={theatre._id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{theatre.name}</td>
                <td>{theatre.city}</td>
                <td>{theatre.owner.name}</td>
                <td>{theatre.screens.length}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No theatres found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
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
  );
}

export default TheatreTable;
