import React from "react";
import { Row, Col, Form, Container } from "react-bootstrap";

const SeatSelection = ({ seats, handleSeatChange }) => {
  return (
    <Container>
      <div>
        {[...Array(10)].map((_, row) => (
          <Row key={row} className="mb-2">
            {[...Array(12)].map((_, col) => (
              <Col key={col} xs={1} className="text-center">
                <Form.Check
                  type="checkbox"
                  id={`seat-${row}-${col}`}
                  checked={!!seats[`${row}-${col}`]}
                  onChange={() => handleSeatChange(row, col)}
                />
              </Col>
            ))}
          </Row>
        ))}
        <h4 style={{ textAlign: 'center' }}>Screen</h4>
      </div>
    </Container>
  );
};
export default SeatSelection;
