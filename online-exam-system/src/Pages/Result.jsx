import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CircularProgress,
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Divider,
  Grid
} from '@mui/material';
import { getResult } from '../Utils/APIRoutes';

const Result = () => {
  const { testId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get(`${getResult}/${testId}`);
        setResult(response.data);
      } catch (error) {
        console.error('Error fetching result:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [testId]);

  useEffect(() => {
    window.onpopstate = () => {
      navigate('/'); // Redirect to home or another page if user tries to go back
    };
  }, [navigate]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Container maxWidth="sm">
        <Box mt={4}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" align="center" gutterBottom>
                Test Result
              </Typography>
              <Divider />
              {result ? (
                <Box mt={3}>
                  <Typography variant="h6">Test: {result.test.title}</Typography>
                  <Typography variant="h6">Subject: {result.test.subject}</Typography>
                  <Divider />
                  <Grid container spacing={2} mt={2}>
                    <Grid item xs={6}>
                      <Typography variant="body1">Total Questions:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">{result.total}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">Correct Answers:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">{result.correct}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">Incorrect Answers:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">{result.incorrect}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">Not Attempted:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">{result.notAttempted}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">Score:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">{((result.correct / result.total) * 100).toFixed(2)}%</Typography>
                    </Grid>
                  </Grid>
                  <Box mt={3} display="flex" justifyContent="center">
                    <Button variant="contained" color="primary" onClick={() => navigate('/')}>Go Home</Button>
                  </Box>
                </Box>
              ) : (
                <Typography variant="h6" align="center" mt={3}>Result not found.</Typography>
              )}
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default Result;
