import React from 'react'
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ThankyouScreen() {
    const navigate = useNavigate();

    const handleHomeClick = () => {
      navigate("/");
    };
  
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Card style={{ maxWidth: "600px", width: "100%", padding: "20px", textAlign: "center" }}>
          <Card.Body>
            <Card.Title>
              <h2>Thank You for Your Booking!</h2>
            </Card.Title>
            <Card.Text className="mt-4">
              <p>Your movie tickets have been successfully booked.</p>
              <p>An email with the booking details has been sent to your email address.</p>
            </Card.Text>
            <Card.Text className="mt-4">
              <h4>Enjoy the Movie!</h4>
            </Card.Text>
            <div className="d-flex justify-content-center mt-4">
              <Button variant="dark" onClick={handleHomeClick}>
                Go to Home
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
}

export default ThankyouScreen