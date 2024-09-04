import React from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Search from "../userComponents/Search";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

function TheatreTable({ theatres }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = theatres.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
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
            <th>Theatre</th>
            <th>City</th>
            <th>Theatre Owner</th>
            <th>No. of Screens</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length > 0 ? (
            filteredItems.map((theatre, index) => (
              <tr key={theatre._id}>
                <td>{index + 1}</td>
                <td>{theatre.name}</td>
                <td>{theatre.city}</td>
                <td>{theatre.owner.name}</td>
                <td>{theatre.screens.length}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No theatres found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default TheatreTable;
