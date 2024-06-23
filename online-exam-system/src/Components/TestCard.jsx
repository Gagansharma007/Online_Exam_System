import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedTest } from '../Slices/testSlice';
import PropTypes from 'prop-types';
const TestCard =  ({ test }) => {
  const dispatch = useDispatch();
  const handleSelectedTest = (test)=> {
    dispatch(setSelectedTest( test ));
  }
  return (
    <Card>
      <CardContent sx={{textAlign : 'center'}} >
        <Typography variant="h5" gutterBottom>
          {test.title}
        </Typography>
        <Typography color="textSecondary">
          Subject: {test.subject}
        </Typography>
        <Typography color="textSecondary">
          Time Limit: {test.timeLimit} minutes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/starttest/${test._id}`}
        >
          Start Test
        </Button>
      </CardContent>
    </Card>
  );
};

TestCard.propTypes = {
  test: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    timeLimit: PropTypes.number.isRequired,
  }).isRequired,
};

export default TestCard;