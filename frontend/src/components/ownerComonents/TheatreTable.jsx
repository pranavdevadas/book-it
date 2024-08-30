import React from "react";
import Table from "react-bootstrap/Table";

function TheatreTable() {
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
        <tr>
          <td>1</td>
          <td>hello</td>
        </tr>
      </tbody>
    </Table>
  );
}

export default TheatreTable;
