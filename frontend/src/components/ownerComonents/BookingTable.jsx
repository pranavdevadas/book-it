import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import { Container, Pagination } from "react-bootstrap";

function BookingTable({ bookings, refetch }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  const currentBooking = bookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  console.log(bookings);

  return (
    <Container>
      <Table striped bordered hover variant="dark" className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Theatre</th>
            <th>Movie</th>
            <th>No. of Seats</th>
            <th>Date & Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentBooking.length > 0 ? (
            currentBooking.map((booking, index) => (
              <tr key={booking._id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{booking.user.name}</td>
                <td>
                  {booking.theatre.name} Screen {booking.screen} (
                  {booking.theatre.city})
                </td>
                <td>{booking.movie.name}</td>
                <td>{booking.seats.length}</td>
                <td>
                  {booking.showTime}, {booking.showDate}
                </td>
                <td>{booking.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                Currently, no bookings here.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

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
  );
}

export default BookingTable;
