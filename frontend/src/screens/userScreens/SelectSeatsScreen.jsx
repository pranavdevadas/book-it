import React, { useEffect, useState } from "react";
import { Alert, Button, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useGetSeatsssQuery,
  useGetAvailableSeatsForBookingQuery,
} from "../../slice/userSlice/userApiSlice";
import Loader from "../../components/userComponents/Loader";

function SelectSeatsScreen() {
  const location = useLocation();
  const { selectedDate, selectedTime, theatreId, screen, movieId } =
    location.state;
  const [clickedSeats, setClickedSeats] = useState(new Set());
  const navigate = useNavigate();
  const {
    data = {},
    error,
    isLoading,
  } = useGetSeatsssQuery({ theatreId, screen });

  const {
    data: bookedSeats = [],
    refetch,
    error: seatsError,
  } = useGetAvailableSeatsForBookingQuery({
    theatreId,
    screen,
    selectedDate,
    selectedTime,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (error) {
    return <Alert variant="danger">{error.data.message}</Alert>;
  }

  if (isLoading) {
    return <Loader />;
  }

  const toggleSeatSelection = (seatIndex) => {
    setClickedSeats((prev) => {
      const newClickedSeats = new Set(prev);
      if (newClickedSeats.has(seatIndex)) {
        newClickedSeats.delete(seatIndex);
      } else {
        newClickedSeats.add(seatIndex);
      }
      return newClickedSeats;
    });
  };

  const seats = data.seats || {};

  const renderSeats = () => {
    const rows = [];
    for (let row = 9; row >= 0; row--) {
      const cols = [];
      for (let col = 0; col < 12; col++) {
        const seatIndex = row * 12 + col;
        const seat = seats[seatIndex] || { isSelected: false };

        if (seat.isSelected) {
          if (bookedSeats.find((es) => es == seat.seatNumber)) {
            cols.push(
              <Button
                key={`${row}-${col}`}
                style={{
                  width: "35px",
                  height: "35px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "0px",
                  backgroundColor: "red",
                  color: "white",
                }}
                className="m-1 text-center"
                disabled
              >
                B
              </Button>
            );
          } else {
            cols.push(
              <Button
                key={`${row}-${col}`}
                onClick={() => toggleSeatSelection(seatIndex)}
                style={{
                  width: "35px",
                  height: "35px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "0px",
                  backgroundColor: clickedSeats.has(seatIndex)
                    ? "green"
                    : "darkgray",
                }}
                className="m-1 text-center"
              >
                {seat.seatNumber}
              </Button>
            );
          }
        } else {
          cols.push(
            <div
              key={`${row}-${col}`}
              style={{ width: "30px", height: "30px" }}
              className="m-1"
            ></div>
          );
        }
      }
      rows.push(
        <div key={row} className="d-flex justify-content-center">
          {cols}
        </div>
      );
    }
    return rows;
  };

  const handleCheckout = () => {
    const selectedSeatNumbers = Array.from(clickedSeats).map(
      (seatIndex) => seats[seatIndex]?.seatNumber
    );
    navigate("/checkout", {
      state: {
        selectedDate,
        selectedTime,
        theatreId,
        screen,
        selectedSeats: selectedSeatNumbers,
        movieId,
      },
    });
  };

  return (
    <Container className="mt-3">
      <h3 className="text-center mt-4 mb-3 fw-bold">Select Seat</h3>
      <div style={{ color: "gray" }}>
        {renderSeats()}
        <h1 className="text-center">screen</h1>
      </div>
      <br />
      <br />
      <br />
      <div className="d-flex justify-content-center">
        <Button
          variant="dark"
          type="submit"
          onClick={handleCheckout}
          disabled={clickedSeats.size === 0}
        >
          Confirm Booking
        </Button>
      </div>
      <br />
      <br />
      <br />
    </Container>
  );
}

export default SelectSeatsScreen;
