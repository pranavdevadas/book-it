import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Container, Pagination } from "react-bootstrap";
import { useToggleTheatreStatusMutation } from "../../slice/ownerSlice/ownerApiSlice";
import { toast } from "react-toastify";

function TheatreTable({ theatres, refetch }) {
  const navigate = useNavigate();
  const [toggleListStatus] = useToggleTheatreStatusMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleToggleStatus = async (id) => {
    try {
      await toggleListStatus(id).unwrap();
      toast.success("Theatre status updated");
      refetch();
    } catch (error) {
      toast.error("Failed to update theatre status");
    }
  };

  const handleEdit = (id) => {
    navigate(`/owner/edit-theatre/${id}`);
  };

  // Calculate paginated theatres
  const totalPages = Math.ceil(theatres.length / itemsPerPage);
  const paginatedTheatres = theatres.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      <Table striped bordered hover variant="dark" className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Theatre</th>
            <th>City</th>
            <th>No. of Screens</th>
            <th>Available seats</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTheatres.length > 0 ? (
            paginatedTheatres.map((theatre, index) => (
              <tr key={theatre._id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{theatre.name}</td>
                <td>{theatre.city}</td>
                <td>{theatre.screens.length}</td>
                <td>
                  {theatre.screens.map((screen, screenIndex) => (
                    <div key={screenIndex}>
                      Screen {screen.name}:{" "}
                      {screen.seats.filter((seat) => seat.isSelected).length} seats
                    </div>
                  ))}
                </td>
                <td>
                  <Button
                    variant="dark"
                    style={{ marginRight: "10px" }}
                    onClick={() => handleEdit(theatre._id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant={theatre.isListed ? "danger" : "success"}
                    onClick={() => handleToggleStatus(theatre._id)}
                  >
                    {theatre.isListed ? "Unlist" : "List"}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No theatres added
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination Controls */}
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
