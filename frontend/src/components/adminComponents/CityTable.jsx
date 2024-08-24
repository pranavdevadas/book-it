import Table from "react-bootstrap/Table";

function CityTable({ cities }) {
  const tableStyle = {
    width: "1000px",
    marginLeft: "310px",
    marginTop: "-484px",
  };

  return (
    <Table striped bordered hover variant="dark" style={tableStyle}>
      <thead>
        <tr>
          <th>#</th>
          <th>City</th>
        </tr>
      </thead>
      <tbody>
        {cities.length > 0 ? (
          cities.map((city, index) => (
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
  );
}

export default CityTable;
