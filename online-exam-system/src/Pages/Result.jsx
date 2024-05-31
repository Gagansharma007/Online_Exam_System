import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  CircularProgress,
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button
} from '@mui/material';
import { getResult } from '../Utils/APIRoutes';

const Result = () => {
  const { testId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Typography variant="h4">Test Result</Typography>
      {result ? (
        <div>
          <Typography variant="h6">Test: {result.test.title}</Typography>
          <Typography variant="h6">Subject: {result.test.subject}</Typography>
          <Typography variant="h6">Total Questions: {result.total}</Typography>
          <Typography variant="h6">Correct Answers: {result.correct}</Typography>
          <Typography variant="h6">Incorrect Answers: {result.incorrect}</Typography>
          <Typography variant="h6">Not Attempted: {result.notAttempted}</Typography>
          <Typography variant="h6">Score: {((result.correct / result.total) * 100).toFixed(2)}%</Typography>
        </div>
      ) : (
        <Typography variant="h6">Result not found.</Typography>
      )}
      <Button variant="contained" color="primary" onClick={() => window.history.back()}>Go Back</Button>
    </Container>
  );
};

export default Result;