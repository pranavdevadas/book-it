import React from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

function TheatreTable({ theatres, refetch }) {
  const navigate = useNavigate();
  const tableStyle = {
    width: "1000px",
    marginLeft: "310px",
    marginTop: "-530px",
  };

  const handleEdit = (id) => {
    navigate(`/owner/edit-theatre/${id}`);
  };

  return (
    <Table striped bordered hover variant="dark" style={tableStyle}>
      <thead>
        <tr>
          <th>#</th>
          <th>Theatre</th>
          <th>City</th>
          <th>Screens</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {theatres.map((theatre, index) => (
          <tr key={theatre._id}>
            <td>{index + 1}</td>
            <td>{theatre.name}</td>
            <td>{theatre.city}</td>
            <td>{theatre.screens.length}</td>
            <td>
              <Button
                variant="dark"
                style={{ marginRight: "10px" }}
                onClick={() => handleEdit(theatre._id)}
              >
                Edit
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TheatreTable;
