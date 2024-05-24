import React , { useState , useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast  } from 'react-toastify';
import { Box , Button , Container, TextField , Typography } from '@mui/material';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import {loginRoute} from '../Utils/APIRoutes';
const Login = () => {
    const navigate = useNavigate();
    const [ values , setValues ] = useState({
        username : "",
        password : "",
    });
    const toastOptions = {
        position: 'bottom-right',
        autoClose: 8000,
        draggable: true,
        theme: 'dark'
    };
    useEffect(()=>{
        if ( localStorage.getItem('online-exam-system')) {
            navigate('/');
        }
    },[navigate]);
    const handleChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value });
    };
    const handleValidation = ()=>{
        const { username , password } = values;
        if( password === ""){
            toast.error("Email and Password are required",toastOptions);
            return false;
        } else if( username === ""){
            toast.error("Email and Password are required",toastOptions);
            return false;
        }
        return true;
    };
    const handlesubmit = async (e) => {
        e.preventDefault();
        if (handleValidation()) {
            const { username, password } = values;
            const { data } = await axios.post(loginRoute, {
              username,
              password,
            });
            if (data.status === false) {
              toast.error(data.msg, toastOptions);
            }
            if (data.status === true) {
              localStorage.setItem('chat-app-user', JSON.stringify(data.user));
              navigate('/');
            }
          }
    }
  return (
    <div>
        <Container component='main' maxWidth='xs'>
            <Box
                sx={{ 
                    marginTop: 8, 
                    display: 'flex',
                    flexDirection : 'column',
                    alignItems: 'center',
                    }}
                >
                    <Typography component='h1' variant='h5'>
                        Log In
                    </Typography>
                    <Box component='form' onSubmit={handlesubmit} sx={{ mt: 3}} >
                        <TextField variant="outlined"
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
                         >Log In</Button>
                        <Typography variant="body2" align="center">
                            Don't have an account? <Link to="/signup">Register</Link>
                        </Typography>
                    </Box>
            </Box>
        </Container>

    </div>
  )
}

export default Login