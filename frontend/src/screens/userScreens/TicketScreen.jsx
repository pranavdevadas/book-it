import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import Ticket from "../../components/userComponents/Ticket";
import { useGetTicketsQuery } from "../../slice/userSlice/userApiSlice";
import Loader from "../../components/userComponents/Loader";

function TicketScreen() {
  const { data: tickets =[], isLoading, refetch, } = useGetTicketsQuery();

  useEffect(() => {
    refetch()
  },[refetch])
  return (
    <Container>
      <h2 className="text-center fw-bold mt-4 mb-4">Tickets</h2>
      {isLoading ? <Loader /> : <Ticket tickets={tickets} refetch= {refetch} />}
    </Container>
  );
}

export default TicketScreen;
