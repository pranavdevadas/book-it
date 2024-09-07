import React, { useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useToggleTheatreStatusMutation } from "../../slice/ownerSlice/ownerApiSlice";
import { toast } from "react-toastify";

function TheatreTable({ theatres, refetch }) {
  const navigate = useNavigate();

  const [toggleListStatus] = useToggleTheatreStatusMutation();

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
          {theatres.length > 0 ? (
            theatres.map((theatre, index) => (
              <tr key={theatre._id}>
                <td>{index + 1}</td>
                <td>{theatre.name}</td>
                <td>{theatre.city}</td>
                <td>{theatre.screens.length}</td>
                <td>
                  {theatre.screens.map((screen, screenIndex) => (
                    <div key={screenIndex}>
                      Screen {screen.name}:{"  "}
                      {"  "}
                      {screen.seats.filter((seat) => seat.isSelected).length}
                      seats
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
              <td colSpan="5" className="text-center">
                No theatres added
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default TheatreTable;
