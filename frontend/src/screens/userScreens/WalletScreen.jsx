import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Wallet from "../../components/userComponents/Wallet";
import Transaction from "../../components/userComponents/Transaction";
import { useGetTransactionsQuery } from "../../slice/userSlice/userApiSlice";

function WalletScreen() {
  const {
    data: transactions,
    isLoading: transactionLoading,
    refetch: transactionRefetch,
  } = useGetTransactionsQuery();

  useEffect(() => {
    transactionRefetch()
  },[transactionRefetch])

  return (
    <Container>
      <Row>
        <Col md={6}>
          <Wallet />
        </Col>
        <Col md={6}>
          <Transaction transactions={transactions}  />
        </Col>
      </Row>
      <br />
      <br />
    </Container>
  );
}

export default WalletScreen;
