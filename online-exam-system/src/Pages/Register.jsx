import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography , Box, Button , Container, TextField, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../Slices/userApiSlice';
import { setCredentials } from '../Slices/authSlice';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.root.auth );
    const [ values , setValues ] = useState({
        username : "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    useEffect(()=>{
        if( userInfo ){
            navigate('/');
        }
    },[ navigate, userInfo ]);
    const [ register , { isLoading }] = useRegisterMutation();
    const handleChange = (e)=>{
        setValues({...values, [e.target.name]: e.target.value});
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const { username, email, password , confirmPassword } = values;
        if( !username || !email || !password || !confirmPassword ){
            toast.error('Please fill all the fields.');
            return;
        }
        if( password !== confirmPassword ){
            toast.error('Password and Confirm Password should match.');
            return;
        }
        try{
            const res = await register({ username , email , password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate('/');
        } catch(err){
            toast.error( err?.data?.msg || err.error );
        }

    }
    return (
        <Container component="main" maxWidth="xs" sx={{ marginBottom : 4}}>
            <Box
                sx={{
                    marginTop: 4,
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
                    { isLoading && 
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <CircularProgress />
                    </div> }
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


export default Register