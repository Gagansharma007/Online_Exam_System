import React, { useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector( state => state.auth );

  useEffect(() => {
    if( !userInfo ){
      navigate('/login');
    }
  }, [navigate , userInfo]);

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
