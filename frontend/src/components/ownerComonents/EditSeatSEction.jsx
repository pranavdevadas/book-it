import React from "react";
import { Row, Col, Form, Container } from "react-bootstrap";

function EditSeatSection({ seats, handleSeatChange }) {
    const seatArray = seats[1] || []; 

    return (
        <Container style={{ backgroundColor: 'gray', opacity: '0.9' }}>
            <div style={{ padding: 'inherit' }}>
                <br />
                {[...Array(10)].map((_, row) => (
                    <Row key={row} className="mb-2">
                        {[...Array(12)].map((_, col) => {
                            const index = row * 12 + col;
                            const seat = seatArray[index];
                            return (
                                <Col key={col} xs={1} className="text-center">
                                    <Form.Check
                                        type="checkbox"
                                        checked={seat ? seat.isAvailable : false} 
                                        id={`seat-${row}-${col}`}
                                        onChange={() => handleSeatChange(row, col)}
                                    />
                                </Col>
                            );
                        })}
                    </Row>
                ))}
                <h4 style={{ textAlign: 'center' }}>Screen</h4>
            </div>
        </Container>
    );
}

export default EditSeatSection;
