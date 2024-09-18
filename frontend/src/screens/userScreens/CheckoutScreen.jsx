import React from "react";
import { Container, Card, ListGroup, Row, Col, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useMoveDetailsByIdQuery,
  useTheatreDetailsByIdQuery,
  useCreateBookingMutation,
} from "../../slice/userSlice/userApiSlice";
import Loader from "../../components/userComponents/Loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function CheckoutScreen() {
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const location = useLocation();
  const {
    selectedDate,
    selectedTime,
    theatreId,
    screen,
    selectedSeats,
    movieId,
  } = location.state;

  const {
    data: movie,
    isLoading: movieLoading,
    error: movieError,
  } = useMoveDetailsByIdQuery(movieId);

  const {
    data: theatre,
    isLoading: theatreLoading,
    error: theatreError,
  } = useTheatreDetailsByIdQuery(theatreId);

  console.log(theatre)

  const [createBooking] = useCreateBookingMutation();

  if (movieLoading || theatreLoading) {
    return <Loader />;
  }

  const totalTickets = selectedSeats.length;
  const totalPrice = totalTickets * theatre.ticketPrice;
  const owner = theatre.owner

  const handlePayment = () => {
    const options = {
      key: "rzp_test_TVVqN3CVooB2Tt",
      amount: totalPrice * 100,
      currency: "INR",
      name: "Book it",
      description: `Booking for ${movie.name} at ${theatre.name}`,
      image: "p",
      handler: async function (response) {
        try {
          await createBooking({
            movieId,
            theatreId,
            screen,
            owner,
            selectedSeats,
            selectedDate,
            selectedTime,
            paymentMethod: "razorpay",
            totalPrice,
          });
          toast.success(`Booking Completed`);
          navigate("/thank-you");
        } catch (error) {
          toast.error(`Booking failed: ${error.message}`);
        }

        console.log(response.razorpay_payment_id);
      },
      prefill: {
        name: userInfo.name,
        email: userInfo.email,
        contact: userInfo.phone,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <Container>
      <h2 className="text-center fw-bold mt-4 mb-4">Checkout</h2>
      <Card style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <strong>Booking Summary</strong>
          </Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Row>
                <Col xs={3} className="font-weight-bold">
                  Theatre:
                </Col>
                <Col xs={9}>
                  {theatre.name} Screen {screen} ({theatre.city})
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col xs={3} className="font-weight-bold">
                  Movie:
                </Col>
                <Col xs={9}>{movie.name}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col xs={3} className="font-weight-bold">
                  Date:
                </Col>
                <Col xs={9}>{selectedDate}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col xs={3} className="font-weight-bold">
                  Time (24hr):
                </Col>
                <Col xs={9}>{selectedTime}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col xs={3} className="font-weight-bold">
                  Seat Number:
                </Col>
                <Col xs={9}>{selectedSeats.join(", ")}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col xs={3} className="font-weight-bold">
                  Ticket Price:
                </Col>
                <Col xs={9}>{theatre.ticketPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col xs={3} className="font-weight-bold">
                  Tickets:
                </Col>
                <Col xs={9}> x {totalTickets}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col xs={3} className="fw-bold">
                  <b>Total Price:</b>
                </Col>
                <Col xs={9}>
                  <h4>
                    <b>Rs. {totalPrice}</b>
                  </h4>
                </Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
      <div className="d-flex justify-content-center mt-4 mb-2">
        <Button variant="dark" onClick={handlePayment}>
          Pay Now
        </Button>
      </div>
    </Container>
  );
}

export default CheckoutScreen;
