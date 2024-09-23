import React, { useState } from "react";
import { TabContainer, Button, Pagination } from "react-bootstrap";
import { format } from "date-fns";
import { useCancelTicketMutation } from "../../slice/userSlice/userApiSlice";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function Ticket({ tickets, refetch }) {
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 4;
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);
  const [cancelTicket] = useCancelTicketMutation();

  const startIndex = (currentPage - 1) * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;
  const currentTickets = tickets.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const isExpired = (showDate, showTime) => {
    const showDateTime = new Date(`${showDate}T${showTime}`);
    return new Date() > showDateTime;
  };

  const canCancel = (showDate, showTime) => {
    const showDateTime = new Date(`${showDate}T${showTime}`);
    const cancelDeadline = new Date(showDateTime.getTime() - 30 * 60000);
    return new Date() < cancelDeadline;
  };

  const handleCancel = async (id, amount) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, cancel it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const cancelled = await cancelTicket({ id, amount }).unwrap();
          refetch();
          Swal.fire({
            title: "Cancelled!",
            text: `${cancelled.message} Refund Amount added to in your wallet.`,
            icon: "success",
          });
        }
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to cancel ticket");
    }
  };

  return (
    <div>
      <TabContainer>
        {tickets.length === 0 ? (
          <div className="text-center mt-5">
            <h2>No tickets available</h2>
          </div>
        ) : (
          currentTickets.map((ticket) => {
            const expired = isExpired(ticket.showDate, ticket.showTime);
            const cancelDisabled = !canCancel(ticket.showDate, ticket.showTime);

            return (
              <div className="d-flex justify-content-center" key={ticket.id}>
                <div style={{ backgroundColor: "white" }}>
                  <div
                    className="shadow mt-4 mb-4"
                    style={{
                      backgroundColor: "#000",
                      width: "900px",
                      color: ticket.isCancelled
                        ? "gray"
                        : expired
                        ? "gray"
                        : "#FFA500",
                      padding: "20px",
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "20px",
                      filter:
                        ticket.isCancelled || expired
                          ? "grayscale(100%)"
                          : "none",
                    }}
                  >
                    <div style={{ textAlign: "left" }}>
                      <img
                        src={`http://localhost:5000/moviePoster/${ticket.movie.poster}`}
                        alt="Movie Poster"
                        style={{
                          width: "120px",
                          filter:
                            ticket.isCancelled || expired
                              ? "grayscale(100%)"
                              : "none",
                        }}
                      />
                      <h2 style={{ margin: "10px 0" }}>{ticket.movie.name}</h2>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <h2 style={{ margin: "10px" }}>
                        Ticket Number: {ticket.ticketNumber}
                      </h2>
                      <p style={{ margin: "5px 0" }}>
                        {format(new Date(ticket.showDate), "dd-MMM")}
                      </p>
                      <p style={{ margin: "5px 0" }}>
                        {ticket.showTime} (24hr)
                      </p>
                      <strong style={{ display: "block", margin: "5px 0" }}>
                        {ticket.theatre.name} Screen {ticket.screen} (
                        {ticket.theatre.city})
                      </strong>
                      {ticket.isCancelled ? (
                        <div>
                          <h4 style={{ color: "red" }}>Refunded</h4>
                        </div>
                      ) : expired ? (
                        <Button variant="secondary" className="mt-3" disabled>
                          Expired
                        </Button>
                      ) : (
                        !cancelDisabled && (
                          <>
                            <Button
                              variant="warning"
                              className="mt-3"
                              disabled={cancelDisabled}
                              onClick={() =>
                                handleCancel(
                                  ticket._id,
                                  ticket.theatre.ticketPrice *
                                    ticket.seats.length
                                )
                              }
                            >
                              Cancel
                            </Button>
                            <p
                              className="mt-1"
                              style={{ fontSize: "10px", color: "red" }}
                            >
                              *Cancel the ticket at least 30 minutes before the
                              show.
                            </p>
                          </>
                        )
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: "5px 0" }}>{ticket.ticketNumber}</p>
                      {ticket.isCancelled ? (
                        <h3>Cancelled</h3>
                      ) : expired ? (
                        <h3>Expired</h3>
                      ) : (
                        <img
                          src={`${ticket.qrCode}`}
                          style={{ width: "130px", margin: "10px 0" }}
                          alt="QR Code"
                        />
                      )}
                      <strong style={{ display: "block", margin: "5px 0" }}>
                        Seats: {ticket.seats.join(", ")}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </TabContainer>

      {tickets.length > 3 && (
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
    </div>
  );
}

export default Ticket;
