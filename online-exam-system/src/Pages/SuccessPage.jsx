import React, { useState , useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authMe } from '../Utils/APIRoutes';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SuccessPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const token = document.cookie.split('; ').find(row => row.startsWith('token='));
              if (!token) {
                  navigate('/login');
              } else {
                  const { data } = await axios.get( authMe , {
                      headers: { Authorization: `Bearer ${token.split('=')[1]}` }
                  });
                  setCurrentUser(data.user);
                  setIsLoaded(true);
              }
          } catch (error) {
              console.error("Error fetching user data:", error);
              toast.error("An error occurred. Please try again later.");
          }
      };

      fetchData();
  }, [navigate]);

  return (
    <Box>
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center'
      }}
    >
      <Typography variant="h4" gutterBottom>
        Test Created Successfully!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')}
      >
        Go to Homepage
      </Button>
    </Container>
    </Box>
  );
};

export default SuccessPage;
