import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFetchTestByIdMutation, useSubmitTestMutation } from '../Slices/userApiSlice';
import StartTest from '../Components/StartTest';
import TestTimer from '../Components/TestTimer';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
  ListItemText,
  List,
  ListItemButton,
} from '@mui/material';

const Test = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [promptOpen, setPromptOpen] = useState(false); 
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [fetchTestById] = useFetchTestByIdMutation();
  const [submitTest] = useSubmitTestMutation();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetchTestById(id).unwrap();
        setTest(response);
      } catch (error) {
        console.error('Error fetching test:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id, fetchTestById]);

  const handleStartTest = async () => {
    enterFullScreen();
    setTestStarted(true);
    setPromptOpen(false); 
  };

  const handleTimeUp = () => {
    handleSubmitTest();
  };

  const handleSubmitTest = async (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    let data = {
      testId: test._id,
      answers: Object.entries(answers).map(([questionId, optionId]) => ({ questionId, optionId })),
    };
    try {
      await submitTest(data).unwrap();
      exitFullScreen();
      navigate(`/result/${test._id}`);
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('An error occurred while submitting the test.');
    }
  };

  const handleChange = (questionId, optionId) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: optionId }));
  };
  const clearResponse = ( questionId ) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers , [questionId]: null}));
  };
  const handleNextQuestion = () => {
    setCurrentQuestionIndex((Index) => Index + 1);
  };
  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((Index) => Index - 1);
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
        {test.questions.map((question, index) => (
          <ListItemButton
            key={question._id}
            onClick={() => setCurrentQuestionIndex(index)}
            style={{
              backgroundColor: answers[question._id] ? 'green' : '#aaaaaa',
              width: '25%',
              height: '50px',
              borderRadius: '8px',
              margin: '8px', 
            }}
          >
            <ListItemText primary={`Q${index + 1}`} />
          </ListItemButton>
        ))}
      </List>
    );
  };
  

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Container disableGutters>
        {!testStarted && (
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
            <Box mb={2} p={2} border={1} borderColor="grey.500" textAlign="center" bgcolor="background.paper">
              <Typography variant="body1">Instructions:</Typography>
              <Typography variant="body1">1. Please read each question carefully before answering.</Typography>
              <Typography variant="body1">2. You have {test.timeLimit} Minutes to complete the test.</Typography>
              <Typography variant="body1">3. Once started, the test cannot be paused or reset.</Typography>
              <Typography variant='body1'>4. You can attempt this test only once.</Typography>
            </Box>
            <Box border={1} borderColor="grey.500" display="flex" justifyContent="center" alignItems="center">
              <Button variant="contained" color="primary" onClick={() => setPromptOpen(true)}>Start Test</Button>
            </Box>
          </Box>
        )}
        {!testStarted && (
          <StartTest
            open={promptOpen}
            onClose={() => setPromptOpen(false)}
            onConfirm={handleStartTest}
          />
        )}
        {testStarted && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">{test.title}</Typography>
                <Typography variant="h6">Username: {userInfo.username}</Typography>
                <Typography variant="h6">Time Left: <TestTimer duration={test.timeLimit} onTimeUp={handleTimeUp} /></Typography>
                <Typography variant="h6">Subject: {test.subject}</Typography>
              </Box>
            </Grid>
            <Grid item xs={9}>
              <Paper elevation={3}>
                <Box p={2}>
                  <Typography variant="h6">Questions</Typography>
                  <Paper style={{ padding: '5px', margin: '5px' }}>
                    <Typography variant="h6">{test.questions[currentQuestionIndex].text}</Typography>
                    <RadioGroup
                      name={test.questions[currentQuestionIndex]._id}
                      value={answers[test.questions[currentQuestionIndex]._id] || ''}
                      onChange={(e) => handleChange(test.questions[currentQuestionIndex]._id, e.target.value)}
                    >
                      {test.questions[currentQuestionIndex].options.map((option) => (
                        <FormControlLabel
                          key={option._id}
                          value={option._id}
                          control={<Radio />}
                          label={option.text}
                        />
                      ))}
                    </RadioGroup>
                  </Paper>
                  <Box display="flex" justifyContent="center" mt={2}>
                    <Button variant='contained' color='primary' sx={{margin: '5px'}} onClick={()=> clearResponse(test.questions[currentQuestionIndex]._id)} >Clear</Button>
                    { currentQuestionIndex > 0 && (
                      <Button variant="contained" color="primary" sx={{ margin : '5px'}} onClick={handlePreviousQuestion}>Previous</Button>
                    )}
                    {currentQuestionIndex < test.questions.length - 1 && (
                      <Button variant="contained" color="primary" sx={{ margin: '5px'}} onClick={handleNextQuestion}>Next</Button>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper elevation={4}>
                <Box p={2}>
                  <Typography variant="h6">Question List</Typography>
                  <List component="nav" >
                    {renderQuestionList()}
                  </List>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mt={2}>
                <Button type="submit" variant="contained" color="primary" onClick={handleSubmitTest}>Submit</Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </div>
  );
};

const enterFullScreen = () => {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { 
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { 
    elem.msRequestFullscreen();
  }
};


const exitFullScreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { 
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { 
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { 
    document.msExitFullscreen();
  }
};

export default Test;