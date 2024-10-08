import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../../components/userComponents/FormContainer.jsx";
import { useAdminLoginMutation } from "../../slice/adminSlice/adminApiSlice.js";
import { setAdminCredentials } from "../../slice/adminSlice/adminAuthSlice.js";
import { toast } from "react-toastify";
import Loader from "../../components/userComponents/Loader.jsx";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [adminLogin, { isLoading }] = useAdminLoginMutation();

  const { adminInfo } = useSelector((state) => state.adminAuth);

  useEffect(() => {
    if (adminInfo) {
      navigate("/admin/home");
    }
  }, [navigate, adminInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      let res = await adminLogin({ email, password }).unwrap();
      dispatch(setAdminCredentials({ ...res }));
      navigate("/admin/home");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
    <FormContainer>
      <h1>Admin Login</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {isLoading && <Loader />}
        <Button type="submit" variant="primary" className="mt-3">
          Login
        </Button>
      </Form>
    </FormContainer>
    <br /><br /><br />
    </>
  );
}

export default LoginScreen;
