import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import FormContainer from "../../components/userComponents/FormContainer.jsx";
import { toast } from "react-toastify";
import {
  useOwnerVerifyOtpMutation,
  useOwnerResendOtpMutation,
} from "../../slice/ownerSlice/ownerApiSlice.js";
import Loader from "../../components/userComponents/Loader.jsx";

function OtpScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const email = location.state?.email || "";
  const [isResendDisabled, setIsResendDisabled] = useState(true); // Initially disabled
  const [timer, setTimer] = useState(30); // Initialize timer to 30 seconds

  const [verifyOtp, { isLoading: verifyLoading }] = useOwnerVerifyOtpMutation();
  const [resendOtp, { isLoading: resendLoading }] = useOwnerResendOtpMutation();

  const resendHandler = async (e) => {
    e.preventDefault();
    try {
      await resendOtp({ email }).unwrap();
      toast.success("OTP Sent Successfully");
      setIsResendDisabled(true);
      setTimer(30); // Restart the timer after resending OTP
    } catch (error) {
      toast.error(error.message || "OTP Resend failed");
    }
  };

  useEffect(() => {
    let interval = null;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled, timer]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!otp) {
        toast.error("Please Enter OTP");
      } else {
        await verifyOtp({ otp, email }).unwrap();
        toast.success("OTP Verified, Please Login");
        navigate("/owner/login");
      }
    } catch (error) {
      toast.error(error.message || "OTP Verification failed");
    }
  };

  return (
    <FormContainer>
      <h1>Enter OTP</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="otp">
          <Form.Label>Enter Your OTP</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter OTP Here"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </Form.Group>
        <Col className="py-2">
          <Button
            variant="link"
            onClick={resendHandler}
            disabled={isResendDisabled || resendLoading}
          >
            {isResendDisabled
              ? `You can Resend the OTP after ${timer}s`
              : "Resend OTP"}
          </Button>
        </Col>
        {(verifyLoading || resendLoading) && <Loader />}
        <Button type="submit" variant="primary" className="mt-3">
          Submit
        </Button>
        <input type="hidden" value={email} />
      </Form>
    </FormContainer>
  );
}

export default OtpScreen;
