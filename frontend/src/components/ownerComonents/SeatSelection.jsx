import React from "react";
import { Button } from "react-bootstrap";

const SeatSelection = ({ seats, handleSeatChange }) => {
  const renderSeats = () => {
    const rows = [];
    for (let row = 9; row >= 0; row--) {
      const cols = [];
      for (let col = 0; col < 12; col++) {
        const seatKey = `${row + 1}-${col + 1}`;
        const seat = seats[seatKey] || {}; 
        cols.push(
          <Button
            key={seatKey}
            style={{ width: "30px", height: "30px" }}
            variant={seat.isSelected ? "success" : "danger"}
            className="m-1"
            onClick={() => handleSeatChange(row, col)}
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
  
  return (
  <div style={{color: 'gray'}}>
    {renderSeats()}
    <h1 className="text-center">Screen</h1>
  </div>
  )
};

export default SeatSelection;
