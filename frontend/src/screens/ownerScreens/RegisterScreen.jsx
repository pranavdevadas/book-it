import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import FormContainer from "../../components/userComponents/FormContainer.jsx";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/userComponents/Loader.jsx";
import { useOwnerRegisterMutation } from "../../slice/ownerSlice/ownerApiSlice.js";

function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading, error }] = useOwnerRegisterMutation();

  const validateForm = () => {
    const hasRepeatedDigitsPattern = /(0123456789|1234567890|0000000000|1111111111|2222222222|3333333333|4444444444|5555555555|6666666666|7777777777|8888888888|9999999999)/;

    // Validate name
    if (!/^[A-Za-z]{3,}$/.test(name)) {
        toast.error('Invalid name');
        return false;
    }

    // Validate email
    if (!/^[a-zA-Z][a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        toast.error('Invalid email');
        return false;
    }

    // Validate phone
    if (!/^\d{10}$/.test(phone) || hasRepeatedDigitsPattern.test(phone)) {
        toast.error('Invalid Mobile number');
        return false;
    }

    // Validate password
    if (!/.{6,}/.test(password)) {
        toast.error('Invalid password: Must be at least 6 characters long, include at least one capital letter and one symbol.');
        return false;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
        toast.error('Password do not match');
        return false;
    }

    return true;
};

  const submitHandler = async (e) => {
    e.preventDefault();

   if (!validateForm()) return 

    try {
      await register({ email, password, phone, name }).unwrap();
      toast.success('OTP Sended to your Registerd Email')
      navigate("/owner/otp", { state: { email } })
    } catch (err) {
      toast.error(err?.data?.message || "An unexpected error occurred");
    }
  };

  return (
    <Form onSubmit={submitHandler}>
      <FormContainer>
        <h1>Register</h1>
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Enter Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2" controlId="phone">
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Mobile"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        {isLoading && <Loader />}
        <Button type="submit" variant="primary" className="mt-3">
          Send OTP
        </Button>
        <Col className="py-2">
          Existing owner? <Link to="/owner/login">Login</Link>
        </Col>
      </FormContainer>
    </Form>
  );
}

export default RegisterScreen;
