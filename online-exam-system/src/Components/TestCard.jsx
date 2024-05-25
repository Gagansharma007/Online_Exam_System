import React from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';

const TestCard = ({ subjectName, description }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div">
          {subjectName} Test
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Take Test</Button>
      </CardActions>
    </Card>
  );
};

export default TestCard;
