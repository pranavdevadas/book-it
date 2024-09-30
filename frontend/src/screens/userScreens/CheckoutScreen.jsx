import React, { useState } from "react";
import {
  Container,
  Card,
  ListGroup,
  Row,
  Col,
  Button,
  Modal,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useMoveDetailsByIdQuery,
  useTheatreDetailsByIdQuery,
  useUpdateBookingMutation,
  useGetWalletBalanceQuery,
} from "../../slice/userSlice/userApiSlice";
import Loader from "../../components/userComponents/Loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

function CheckoutScreen() {
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const location = useLocation();
  const {
    selectedDate,
    selectedTime,
    theatreId,
    bookingId,
    screen,
    selectedSeats,
    movieId,
  } = location.state;

  const { data: movie, isLoading: movieLoading } =
    useMoveDetailsByIdQuery(movieId);

  const { refetch: walletRefetch } = useGetWalletBalanceQuery();

  const { data: theatre, isLoading: theatreLoading } =
    useTheatreDetailsByIdQuery(theatreId);

  const [updateBooking] = useUpdateBookingMutation();

  const [showModal, setShowModal] = useState(false);

  if (movieLoading || theatreLoading) {
    return <Loader />;
  }

  const totalTickets = selectedSeats.length;
  const totalPrice = totalTickets * theatre.ticketPrice;

  const handlePayment = () => {
    setShowModal(true);
  };

  const handleRazorpayPayment = () => {
    const options = {
      key: "rzp_test_TVVqN3CVooB2Tt",
      amount: totalPrice * 100,
      currency: "INR",
      name: "Book it",
      description: `Booking for ${movie.name} at ${theatre.name}`,
      handler: async function (response) {
        try {
          await updateBooking({
            bookingId,
            paymentMethod: "razorpay",
            paymentStatus: "completed",
            totalPrice,
          });
          //toast.success("Booking Completed");
          walletRefetch()
          navigate("/thank-you");
        } catch (error) {
          console.log(error)
          // toast.error(
          //   `Booking failed: ${error.data?.message || error.message}`
          // );
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

  const handleWalletPayment = async () => {
    try {
      let timerInterval;

      Swal.fire({
        title: "Wallet payment",
        html: "Confirming your booking",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup().querySelector("b");
          timerInterval = setInterval(() => {
            if (timer) {
              timer.textContent = `${Swal.getTimerLeft()}`;
            }
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then(async (result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          try {
            const response = await updateBooking({
              bookingId,
              paymentMethod: "wallet",
              paymentStatus: "completed",
              totalPrice,
            });

            if (response.error) {
              throw new Error(response.error.data.message);
            }
            navigate("/thank-you");
          } catch (error) {
            toast.error(error.message || "Booking failed");
          }
        }
      });
    } catch (error) {
      toast.error(error.message || "Booking failed");
    }
    setShowModal(false);
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Payment Method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button
            variant="primary"
            className="w-100 mb-3"
            onClick={handleWalletPayment}
          >
            Pay with Wallet
          </Button>
          <Button
            variant="secondary"
            className="w-100"
            onClick={handleRazorpayPayment}
          >
            Pay with Razorpay
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default CheckoutScreen;
