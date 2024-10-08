import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useToggleListStatusMutation } from "../../slice/adminSlice/adminApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Container, Pagination } from "react-bootstrap";
import Search from "../userComponents/Search";
import { useState } from "react";

function MovieTable({ movies, refetch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);

  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
    <>
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
              <th>Movie</th>
              <th>Categories</th>
              <th>Languages</th>
              <th>Duration</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMovies.length > 0 ? (
              paginatedMovies.map((movie, index) => (
                <tr key={movie._id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
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
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No movies found
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
    </>
  );
}

export default MovieTable;
