import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerRoute } from '../Utils/APIRoutes.js';

const Register = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const { username, email, password, confirmPassword } = values;

        if (!username || !email || !password || !confirmPassword) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Password and Confirm Password should match.");
            return;
        }

        try {
            const { data } = await axios.post(registerRoute, {
                username,
                email,
                password,
            });
            
            if (data.status === true) {

                navigate('/login');
            } else {
                
                toast.error(data.msg);
            }
        } catch (error) {
            console.error("An error occurred:", error);
            toast.error("An error occurred. Please try again later.");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Create User
                    </Button>
                    <Box textAlign="center">
                        <Typography variant="body2">
                            Already have an account? <Link to="/login">Login</Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;