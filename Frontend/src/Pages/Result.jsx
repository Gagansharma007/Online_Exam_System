import React, { useEffect, useState } from 'react';
import { useViewTestMutation } from '../Slices/userApiSlice';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CircularProgress,
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Divider,
  TableCell,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody
} from '@mui/material';

const Result = () => {
  const { testId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [ viewTest ] = useViewTestMutation();
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await viewTest(testId).unwrap();
        setResults(response);
      } catch (error) {
        console.error('Error fetching result:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [testId , viewTest ]);

  useEffect(() => {
    window.onpopstate = () => {
      navigate('/');
    };
  }, [navigate]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="lg">
      <Box mt={4}>
        <Paper elevation={3}>
          <Box p={3}>
            <Typography variant="h4" align="center" gutterBottom>
              Test Results
            </Typography>
            <Divider />
            {results && results.length > 0 ? (
              <TableContainer component={Paper} elevation={3}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Index</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Total Questions</TableCell>
                      <TableCell>Correct Questions</TableCell>
                      <TableCell>Incorrect Questions</TableCell>
                      <TableCell>Unattempted Questions</TableCell>
                      <TableCell>Score</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>View Result</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{result.test.subject}</TableCell>
                        <TableCell>{result.test.title}</TableCell>
                        <TableCell>{result.total}</TableCell>
                        <TableCell>{result.correct}</TableCell>
                        <TableCell>{result.incorrect}</TableCell>
                        <TableCell>{result.notAttempted}</TableCell>
                        <TableCell>{((result.correct / result.total) * 100).toFixed(2)}%</TableCell>
                        <TableCell>{result.createdAt.slice(0, 10)}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate(`/viewtest/${result._id}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="h6" align="center" mt={3}>
                No results found.
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Result;
