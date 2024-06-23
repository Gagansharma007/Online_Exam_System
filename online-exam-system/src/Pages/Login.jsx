import { useState, useEffect } from 'react';
import { Box , Typography , Button, Container, TextField, CircularProgress} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLoginMutation } from '../Slices/userApiSlice';
import { setCredentials } from '../Slices/authSlice';
import { toast } from 'react-toastify';
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const [ login , { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector(state=> state.root.auth);
  useEffect(()=>{
    if( userInfo ){
      navigate('/');
    }
  },[userInfo, navigate]);
  const handleChange = (e)=>{
    setValues({...values, [e.target.name] : e.target.value });
  }
  const handleSubmit = async (e)=>{
    e.preventDefault();
    const { username , password } = values;

    if( !username || !password ){
      toast.error('Please enter both username and password');
      return;
    }
    try{
      const res = await login({ username , password }).unwrap();
      dispatch(setCredentials({...res}));
      navigate('/');
    } catch(err){
      toast.error(err?.data?.msg || err.error);
    }
  }
  

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
                    { 
                    isLoading && 
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <CircularProgress />
                    </div> 
                    }
                    <Typography variant="body2" align="center">
                        Don't have an account? <Link to="/register">Register</Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
  )
}

export default Login