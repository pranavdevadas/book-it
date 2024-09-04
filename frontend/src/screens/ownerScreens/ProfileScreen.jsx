import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../../components/userComponents/FormContainer.jsx";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/userComponents/Loader.jsx";
import { setOwnerCredentials } from "../../slice/ownerSlice/ownerAuthSlice.js";
import { useOwnerUpdateMutation } from "../../slice/ownerSlice/ownerApiSlice.js";
import SideBarOwner from "../../components/ownerComonents/SideBar.jsx";

function ProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ownerInfo } = useSelector((state) => state.ownerAuth);

  let [updateProfile, { isLoading }] = useOwnerUpdateMutation();

  useEffect(() => {
    if (ownerInfo) {
      setName(ownerInfo.name || "");
      setEmail(ownerInfo.email || "");
      setPhone(ownerInfo.phone || "");
    }
  }, [ownerInfo]);

  const validateForm = () => {
    const hasRepeatedDigitsPattern =
      /(0123456789|1234567890|0000000000|1111111111|2222222222|3333333333|4444444444|5555555555|6666666666|7777777777|8888888888|9999999999)/;

    // Validate name
    if (!/^[A-Za-z]{3,}$/.test(name)) {
      toast.error("Invalid name");
      return false;
    }

    // Validate email
    if (
      !/^[a-zA-Z][a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      toast.error("Invalid email");
      return false;
    }

    // Validate phone
    if (!/^\d{10}$/.test(phone) || hasRepeatedDigitsPattern.test(phone)) {
      toast.error("Invalid Mobile number");
      return false;
    }

    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const result = await updateProfile({
        name,
        email,
        phone,
        password: password || undefined,
      }).unwrap();
      dispatch(setOwnerCredentials(result));
      toast.success("Profile Updated");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return (
    <div className="d-flex">
      <SideBarOwner />
      <div className="content">
        <Form onSubmit={submitHandler}>
          <FormContainer>
            <h1>Update Profile</h1>
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
              Update
            </Button>
          </FormContainer>
        </Form>
      </div>
    </div>
  );
}

export default ProfileScreen;
