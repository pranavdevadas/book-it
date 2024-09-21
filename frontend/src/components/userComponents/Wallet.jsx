import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  useAddAmountToWalletMutation,
  useGetWalletBalanceQuery,
} from "../../slice/userSlice/userApiSlice";
import { useSelector } from "react-redux";

function Wallet({ transactionRefetch }) {
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);

  const [addAmount] = useAddAmountToWalletMutation();
  const { data: walletData, error, refetch } = useGetWalletBalanceQuery();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (walletData) {
      setBalance(0 || walletData);
    }
    if (error) {
      toast.error("Failed to load wallet balance");
    }
  }, [walletData, error]);

  const addFunds = async (e) => {
    e.preventDefault()

    if (isNaN(amount) || amount < 100 || amount > 2000) {
      toast.error("Amount must be between Rs. 100 and Rs. 2000.");
      return;
    }
    
    const options = {
      key: "rzp_test_TVVqN3CVooB2Tt",
      amount: amount * 100,
      currency: "INR",
      name: "Add Funds",
      description: "Adding funds to wallet",
      handler: async (response) => {
        try {
          const wallet = await addAmount({ amount }).unwrap();
          setBalance(wallet.balance);
          toast.success(`Amount added successfully!`);
          setAmount(0);
          refetch();
          transactionRefetch();
        } catch (error) {
          toast.error(error.data?.message || "Failed to add funds");
        }
      },
      prefill: {
        name: userInfo.name,
        email: userInfo.email,
        contact: userInfo.phone || "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <h2 className="text-center mt-3">Wallet</h2>
          <Card.Text className="text-center mt-3 mb-3">
            Current Balance: <strong>Rs. {balance}</strong>
          </Card.Text>
          <Form>
            <Form.Group controlId="formAmount">
              <Form.Label className="mt-3">Amount</Form.Label>
              <Form.Control
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </Form.Group>
            <div className="d-flex justify-content-center mt-4">
              <Button variant="success" onClick={(e) => addFunds(e)}>
                Add Funds
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <br />
    </Container>
  );
}

export default Wallet;
