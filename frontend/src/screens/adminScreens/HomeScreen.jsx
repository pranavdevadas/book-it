import React from "react";
import SideBarAdmin from "../../components/adminComponents/SideBar";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useGetTop5MoviesQuery } from "../../slice/ownerSlice/ownerApiSlice";
import { useGetBookingsQuery } from "../../slice/adminSlice/adminApiSlice";
import MovieRatingTable from "../../components/adminComponents/MovieRatingTable";
import Chart from "../../components/adminComponents/Chart";
import Loader from "../../components/userComponents/Loader";

function HomeScreen() {
  const { data: bookings = [], isLoading: bookingLoading } = useGetBookingsQuery();
  const { data: topMovies, isLoading } = useGetTop5MoviesQuery();

  const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed');
  const cancelled = bookings.filter(booking => booking.status === 'cancelled').length
  const totalRevenue = confirmedBookings.reduce((total, booking) => total + booking.payment.amount, 0);

  return (
    <div className="d-flex">
      <SideBarAdmin />
      <div className="content">
        <Container>
          <h2 className="fw-bold text-center mb-4">Home Screen</h2>
          <Row className="d-flex justify-content-center mt-4 mb-4">
            {bookingLoading && <Loader />}
            <Col xs="auto">
              <Card style={{ width: "160px", height: "100px" }}>
                <Card.Body>
                  <Card.Title className="text-success">
                    <b>Total Booking</b>
                  </Card.Title>
                  <Card.Title className="text-center">
                    <b>{bookings.length}</b>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col xs="auto">
              <Card style={{ width: "160px", height: "100px" }}>
                <Card.Body>
                  <Card.Title >
                    <b>Total Revenue</b>
                  </Card.Title>
                  <Card.Title className="text-center text-warning">
                    <b>Rs. {totalRevenue} </b>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col xs="auto">
              <Card style={{ width: "199px", height: "100px" }}>
                <Card.Body>
                  <Card.Title className="text-danger">
                    <b>Cancelled Booking</b>
                  </Card.Title>
                  <Card.Title className="text-center">
                    <b>{cancelled} </b>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Chart/>
          <MovieRatingTable topMovies={topMovies} isLoading={isLoading} />
          <br /><br />
        </Container>
      </div>
    </div>
  );
}

export default HomeScreen;
