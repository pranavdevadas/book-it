import Table from "react-bootstrap/Table";
import Search from "../../components/userComponents/Search.jsx";
import { useState } from "react";

function CityTable({ cities }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = cities.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
          {filteredItems.length > 0 ? (
            filteredItems.map((city, index) => (
              <tr key={city._id}>
                <td>{index + 1}</td>
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
    </>
  );
}

export default CityTable;
