import Table from "react-bootstrap/Table";
import Search from "../../components/userComponents/Search.jsx";
import { useState } from "react";
import { Pagination } from "react-bootstrap";

function CityTable({ cities }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredItems = cities.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedCities = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Table
        striped
        bordered
        hover
        variant="dark"
        className="rounded overflow-hidden"
      >
        <thead>
          <tr>
            <th>#</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCities.length > 0 ? (
            paginatedCities.map((city, index) => (
              <tr key={city._id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{city.name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No cities found</td>
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
    </>
  );
}

export default CityTable;
