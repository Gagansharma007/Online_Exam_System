import React, { useEffect, useState } from 'react';
import TestCard from './TestCard';
import { useParams } from 'react-router-dom';
import { CircularProgress, Grid, Typography, Container } from '@mui/material';
import { useFetchTestBySubjectMutation } from '../Slices/userApiSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const TestList = () => {
  const { subject } = useParams();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ fetchTestBySubject ] = useFetchTestBySubjectMutation();
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetchTestBySubject(subject).unwrap();
        setTests(response);
      } catch (error) {
        console.error('Error fetching tests:', error);
        toast.error('Error fetching tests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [subject , fetchTestBySubject ]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
    <Container sx={{margin: '20px'}}>
      <Typography sx={{textAlign: 'center'}} variant="h4" gutterBottom>
        {subject} Tests
      </Typography>
      <Grid container spacing={3}>
        {tests.length > 0 ? (
          tests.map((test) => (
            <Grid item xs={12} sm={6} md={4} key={test._id}>
              <TestCard test={test} />
            </Grid>
          ))
        ) : (
          <Typography variant="h6">No tests available for this subject.</Typography>
        )}
      </Grid>
    </Container>
    </div>
  );
};

export default TestList;
