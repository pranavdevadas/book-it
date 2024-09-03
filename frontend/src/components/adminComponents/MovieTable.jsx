import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import {
  useToggleListStatusMutation,
  useEditMovieMutation,
} from "../../slice/adminSlice/adminApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

function MovieTable({ movies, refetch }) {
  const [toggleListStatus] = useToggleListStatusMutation();
  const navigate = useNavigate();

  const handleToggleStatus = async (id) => {
    try {
      await toggleListStatus(id).unwrap();
      toast.success("Movie status updated");
      refetch();
    } catch (error) {
      toast.error("Failed to update movie status");
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-movie/${id}`);
  };

  return (
    <Container>
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
            <th>Movie</th>
            <th>Categories</th>
            <th>Languages</th>
            <th>Duration</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie, index) => (
            <tr key={movie._id}>
              <td>{index + 1}</td>
              <td>{movie.name}</td>
              <td>{movie.categories.join(", ")}</td>
              <td>{movie.language.join(", ")}</td>
              <td>{movie.duration}hr</td>
              <td>
                <Button
                  variant="dark"
                  style={{ marginRight: "10px" }}
                  onClick={() => handleEdit(movie._id)}
                >
                  Edit
                </Button>
                <Button
                  variant={movie.isListed ? "danger" : "success"}
                  onClick={() => handleToggleStatus(movie._id)}
                >
                  {movie.isListed ? "Unlist" : "List"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default MovieTable;
