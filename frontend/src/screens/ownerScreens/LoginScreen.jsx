import { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../../components/userComponents/FormContainer.jsx';
import { useOwnerLoginMutation } from '../../slice/ownerSlice/ownerApiSlice.js';
import { setOwnerCredentials } from '../../slice/ownerSlice/ownerAuthSlice.js'
import { useOwnerResendOtpMutation } from '../../slice/ownerSlice/ownerApiSlice.js';
import { toast } from 'react-toastify';
import Loader from '../../components/userComponents/Loader.jsx'

function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [ownerLogin, { isLoading }] = useOwnerLoginMutation();
    const [resend] = useOwnerResendOtpMutation();

    const { ownerInfo } = useSelector((state) => state.ownerAuth);
    
    useEffect(() => {
        if (ownerInfo) {
            navigate('/owner/home');
        }
    }, [navigate, ownerInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
        let res = await ownerLogin({ email, password }).unwrap()        
        
        if (!res.isVerified) {
            await resend({ email: res.email }).unwrap();
            navigate('/owner/otp', { state: { email: res.email } });
            toast.error('You are not verified. An OTP has been sent to your email.');
        } else {
            dispatch(setOwnerCredentials({...res}))
            toast.success('Logged In');
            navigate('/owner/home')
        }
       } catch (err) {
        toast.error(err?.data?.message || err.error);
       }
       
    };

    return (
        <FormContainer>
            <h1>Theatre Owner Login</h1>
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

                {isLoading && <Loader/>}
                <Button type="submit" variant="primary" className="mt-3">
                    Login
                </Button>
            </Form>
        </FormContainer>
    );
}

export default LoginScreen;
