import React, { useState } from "react";
import OtpInput from "react-otp-input";
import FormContainer from "../../components/userComponents/FormContainer";
import { Form, Button } from "react-bootstrap";
import {
  useSendOtpToMobileMutation,
  useConfirmOtpAndChangePasswordMutation,
} from "../../slice/userSlice/userApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/userComponents/Loader";

function ForgetPasswordScreen() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [sendOtpToMobile, { isLoading }] = useSendOtpToMobileMutation();
  const [confirmOtpAndChangePassword] =
    useConfirmOtpAndChangePasswordMutation();

  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await sendOtpToMobile({ phone }).unwrap();
      toast.success(res.message);
      setOtpSent(true);
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await confirmOtpAndChangePassword({
        phone,
        otp,
        newPassword,
      }).unwrap();
      toast.success(res.message);
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to change password");
    }
  };

  return (
    <FormContainer>
      <h1>Forgot Password</h1>
      <Form onSubmit={handleSendOtp}>
        <Form.Group className="my-2" controlId="phone">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={otpSent}
          />
        </Form.Group>
        {!otpSent && (
          <Button type="submit" variant="primary" className="mt-3 mb-3">
            Send OTP
          </Button>
        )}
      </Form>
      {isLoading && <Loader />}
      {otpSent && (
        <Form onSubmit={handleChangePassword}>
          <Form.Group className="my-2" controlId="otp">
            <Form.Label>OTP</Form.Label>
            <Form.Control
              type="otp"
              placeholder='enter your otp'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="my-2" controlId="newPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="my-2" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="mt-3 mb-3">
            Change Password
          </Button>
        </Form>
      )}
    </FormContainer>
  );
}

export default ForgetPasswordScreen;
