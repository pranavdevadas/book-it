import React from "react";
import { Button } from "react-bootstrap";

const EditSeatSelection = ({ screenIndex, seats, handleSeatChange }) => {
  const renderSeats = () => {
    const rows = [];
    for (let row = 9; row >= 0; row--) { 
      const cols = [];
      for (let col = 0; col < 12; col++) {
        const seatIndex = row * 12 + col; 
        const seat = seats[seatIndex] || { isSelected: false };
        cols.push(
          <Button
            key={`${row}-${col}`}
            style={{ width: "30px", height: "30px" }}
            variant={seat.isSelected ? "success" : "danger"}
            className="m-1"
            onClick={() => handleSeatChange(screenIndex, row, col)}
          >
          </Button>
        );
      }
      rows.push(
        <div key={row} className="d-flex justify-content-center">
          {cols}
        </div>
      );
    }
    return rows;
  };

  return( 
  <div>
    {renderSeats()}
    <h1 className="text-center">Screen</h1>
  </div>)
};

export default EditSeatSelection;
