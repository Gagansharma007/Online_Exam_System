import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetResultByIdMutation, useFetchTestByIdMutation } from '../Slices/userApiSlice';
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
  Grid,
} from '@mui/material';
import { useSelector } from 'react-redux';

const ViewTest = () => {
  const { resultId } = useParams();
  const [getResultById] = useGetResultByIdMutation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [test, setTest] = useState(null);
  const [fetchTestById] = useFetchTestByIdMutation();
  const { userInfo } = useSelector( state => state.auth );
  useEffect(()=>{
    if( !userInfo ){
      navigate('/');
    }
  },[userInfo, navigate]);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getResultById(resultId).unwrap();
        setResult(res);
      } catch (err) {
        console.error('Error fetching result:', err);
      }
    }
    fetchData();
  }, [getResultById, resultId]);

  useEffect(() => {
    async function fetchTestDetails() {
      if (result && result.test._id) {
        try {
          const res = await fetchTestById(result.test._id).unwrap();
          setTest(res);
        } catch (err) {
          console.error('Error fetching test details:', err);
        }
      }
    }
    fetchTestDetails();
  }, [fetchTestById, result]);

  if (!test || !test.questions || !result) {
    return <div>Loading...</div>;
  }

  const renderQuestionList = () => {
    return (
      <List
        sx={{
          display: 'flex',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          padding: '8px 4px',
        }}
      >
        {test.questions.map((question, index) => {
          const attemptedAnswer = result.attemptedAnswers.find(
            (attemptedAnswer) => attemptedAnswer.question === question._id
          );

          let backgroundColor = '#aaaaaa';

          if (attemptedAnswer) {
            const selectedOption = attemptedAnswer.selectedOption;
            const correctOption = question.options.find(option => option.isCorrect);

            if (selectedOption === correctOption._id) {
              backgroundColor = 'green'; 
            } else if( selectedOption ) {
              backgroundColor = 'red'; 
            }
          } 

          return (
            <ListItem
              key={question._id}
              style={{
                backgroundColor,
                width: '25%',
                height: '50px',
                borderRadius: '8px',
                margin: '8px',
              }}
            >
              <ListItemText primary={`Q${index + 1}`} />
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <div>
      <Box style={{display: 'flex' , flexDirection: 'row' , alignItems: 'center' , justifyContent : 'center',
        padding: '10px'
       }}>
        <Typography variant="h5" style={{marginRight: '50px'}}>{test.title}</Typography>
        <Typography variant="h5" style={{marginRight: '50px'}}>Subject: {test.subject}</Typography>
        <Typography variant="h5" style={{marginRight: '50px'}}>Score: {result.correct} / {test.questions.length}</Typography>
        <Typography variant="h5" style={{marginRight: '50px'}}>{userInfo.username}</Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          {test.questions.map((question, index) => {
            const attemptedAnswer = result.attemptedAnswers.find(
              (attemptedAnswer) => attemptedAnswer.question === question._id
            );
            return (
              <Paper key={question._id} elevation={3} style={{ padding: '10px', margin: '10px' }}>
                <Typography variant="h6">{index + 1}. {question.text}</Typography>
                <List>
                  {question.options.map((option, idx) => (
                    <ListItem
                      key={option._id}
                      style={{
                        backgroundColor: option.isCorrect ? 'lightgreen' : 'transparent',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        marginTop: '5px',
                      }}
                    >
                      <ListItemText primary={`${String.fromCharCode(97 + idx)}. ${option.text}`} />
                      {option.isCorrect && (
                        <Typography variant="body2" color="primary" sx={{ marginLeft: '10px' }}>
                          Correct Answer
                        </Typography>
                      )}
                      {attemptedAnswer && attemptedAnswer.selectedOption === option._id && (
                        <Typography variant="body2" color="secondary" sx={{ marginLeft: '10px' }}>
                          Your Answer
                        </Typography>
                      )}
                    </ListItem>
                  ))}
                </List>
              </Paper>
            );
          })}
        </Grid>
        <Grid item xs={3}>
          <Paper elevation={4}>
            <Box p={2}>
              <Typography variant="h6">Question List</Typography>
              <List component="nav">
                {renderQuestionList()}
              </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewTest;
