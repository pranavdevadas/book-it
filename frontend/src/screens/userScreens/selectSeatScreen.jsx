import React from "react";
import Container from "react-bootstrap";
import { useGetSeatsForBookingQuery } from "../../slice/userSlice/userApiSlice";

function selectSeatScreen() {
  return (
    <Container>
      <h2 className="text-center mt-3 fw-bold">Book Movies Now</h2>
    </Container>
  );
}
export default selectSeatScreen;
