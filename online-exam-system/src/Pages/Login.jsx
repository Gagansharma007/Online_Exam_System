import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { loginRoute } from '../Utils/APIRoutes';

const Login = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password } = values;
        
        if (!username || !password) {
            toast.error("Please enter both username and password");
            return;
        }

        try {
            const { data } = await axios.post(loginRoute, {
                username,
                password,
            });
            if (data.status === true) {
                
                document.cookie = `token=${data.token}; path=/;`;

                navigate('/');
            } else {
                toast.error(data.msg);
            }
        } catch (error) {
            console.error("An error occurred:", error);
            toast.error("An error occurred. Please try again later.");
        }
    };

    return (
        <Container component='main' maxWidth='xs'>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component='h1' variant='h5'>
                    Log In
                </Typography>
                <Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }} >
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
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Log In
                    </Button>
                    <Typography variant="body2" align="center">
                        Don't have an account? <Link to="/signup">Register</Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;