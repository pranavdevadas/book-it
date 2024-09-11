import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { useToggleStatusMutation } from "../../slice/ownerSlice/ownerApiSlice.js";
import { Container, Pagination } from "react-bootstrap";

function NowShowingTable({ nowShowing, refetch }) {
  const [toggleListStatus] = useToggleStatusMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(nowShowing.length / itemsPerPage);

  const currentShows = nowShowing.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleToggleStatus = async (id) => {
    try {
      await toggleListStatus(id).unwrap();
      toast.success("Show status updated");
      refetch();
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      <Table striped bordered hover variant="dark" className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Movie</th>
            <th>Theatre</th>
            <th>Screen</th>
            <th>Time (In 24hr)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentShows.length > 0 ? (
            currentShows.map((show, index) => (
              <tr key={show._id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{show.movie.name}</td>
                <td>{show.theatre.name} ({show.theatre.city})</td>
                <td>{show.screen}</td>
                <td>{show.showtime.join(", ")}</td>
                <td>
                  <Button
                    variant={show.isListed ? "danger" : "success"}
                    onClick={() => handleToggleStatus(show._id)}
                  >
                    {show.isListed ? "Unlist" : "List"}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                Currently, no shows are playing
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          
          {[...Array(totalPages).keys()].map((page) => (
            <Pagination.Item
              key={page + 1}
              active={currentPage === page + 1}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </Pagination.Item>
          ))}

          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      )}
    </Container>
  );
}

export default NowShowingTable;
