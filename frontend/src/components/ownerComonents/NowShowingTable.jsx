import React from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { useToggleStatusMutation } from "../../slice/ownerSlice/ownerApiSlice.js";
import { Container } from "react-bootstrap";

function NowShowingTable({ nowShowing, refetch }) {
  const [toggleListStatus] = useToggleStatusMutation();

  const handleToggleStatus = async (id) => {
    try {
      await toggleListStatus(id).unwrap();
      toast.success("Show status updated");
      refetch();
    } catch (error) {
      toast.error(error.data.message);
    }
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
          {nowShowing.length > 0 ? (
            nowShowing.map((show, index) => (
              <tr key={show._id}>
                <td>{index + 1}</td>
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
    </Container>
  );
}

export default NowShowingTable;
