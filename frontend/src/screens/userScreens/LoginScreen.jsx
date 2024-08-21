import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../../components/userComponents/FormContainer.jsx';
import { useLoginMutation, useResendOtpMutation } from '../../slice/userSlice/userApiSlice.js';
import { setCredentials } from '../../slice/userSlice/userAuthSlice.js';
import { toast } from 'react-toastify';
import Loader from '../../components/userComponents/Loader.jsx';

function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();
    const [resend] = useResendOtpMutation();

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        // If userInfo exists and isVerified is true, redirect to homepage
        if (userInfo && userInfo.isVerified) {
            navigate('/');
        }
    }, [userInfo, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();

            if (!res.isVerified) {
                await resend({ email: res.email }).unwrap();
                navigate('/otp', { state: { email: res.email } });
                toast.error('You are not verified. An OTP has been sent to your email.');
            } else {
                dispatch(setCredentials(res));
                toast.success('Logged In');
                navigate('/');
            }
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <FormContainer>
            <h1>Sign In</h1>
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
                    Sign In
                </Button>
            </Form>
            <Row className="py-3">
                <Col>
                    New Customer? <Link to="/register">Register</Link>
                </Col>
            </Row>
        </FormContainer>
    );
}

export default LoginScreen;
