import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemButton
} from '@mui/material';
import Header from '../Components/Header';
import { getQuestionById, submitQuiz, canStart } from '../Utils/APIRoutes';
import { UserContext } from '../Components/UserContext';

// StartTestPrompt Component
const StartTestPrompt = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{"Start Test?"}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to take the test? It will switch to full-screen mode.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">No</Button>
      <Button onClick={onConfirm} color="primary" autoFocus>Yes</Button>
    </DialogActions>
  </Dialog>
);

// AttemptWarning Component
const AttemptWarning = ({ open, onClose }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{"Attempt Warning"}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        You have already attempted this test. The number of attempts allowed is only one.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">OK</Button>
    </DialogActions>
  </Dialog>
);

const TestTimer = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  return (
    <Typography variant="body1">
      Time Remaining: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
    </Typography>
  );
};

const Test = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [promptOpen, setPromptOpen] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [attemptWarningOpen, setAttemptWarningOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`${getQuestionById}/${id}`);
        setTest(response.data);
      } catch (error) {
        console.error('Error fetching test:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  const handleStartTest = async () => {
    try {
      const response = await axios.get(`${canStart}/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      if (response.data.allowed) {
        enterFullScreen();
        setTestStarted(true);
        setPromptOpen(false);
      } else {
        setAttemptWarningOpen(true);
        setPromptOpen(false);
      }
    } catch (error) {
      console.error('Error checking test start:', error);
    }
  };

  const handleTimeUp = () => {
    handleSubmitTest();
  };

  const handleSubmitTest = async (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    try {
      await axios.post(submitQuiz, {
        testId: test._id,
        answers: Object.entries(answers).map(([questionId, optionId]) => ({ questionId, optionId }))
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
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

  const renderQuestionList = () => {
    return test.questions.map((question, index) => {
      const status = answers[question._id] ? 'green' : 'red';
      return (
        <ListItemButton
          key={question._id}
          onClick={() => {
            document.getElementById(question._id).scrollIntoView({ behavior: 'smooth' });
          }}
          style={{ backgroundColor: status }}
        >
          <ListItemText primary={`Q${index + 1}`} />
        </ListItemButton>
      );
    });
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      {!testStarted && (<Header />)}
      <Container maxWidth="lg">
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
          <StartTestPrompt
            open={promptOpen}
            onClose={() => setPromptOpen(false)}
            onConfirm={handleStartTest}
          />
        )}
        {attemptWarningOpen && (
          <AttemptWarning
            open={attemptWarningOpen}
            onClose={() => setAttemptWarningOpen(false)}
          />
        )}
        {testStarted && (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Paper elevation={3}>
              <Box p={2}>
                  <Typography variant="h5">{test.title}</Typography>
                  <Typography variant="body1">{test.subject}</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={3}>
                <Box p={2}>
                  <Typography variant="h6">Username: {user.username}</Typography>
                  <TestTimer duration={test.timeLimit} onTimeUp={handleTimeUp} />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={3}>
                <Box p={2}>
                  <Typography variant="h6">Questions</Typography>
                  {test.questions.map((question) => (
                    <Paper key={question._id} style={{ padding: '16px', margin: '16px 0' }} id={question._id}>
                      <Typography variant="h6">{question.text}</Typography>
                      <RadioGroup
                        name={question._id}
                        value={answers[question._id] || ''}
                        onChange={(e) => handleChange(question._id, e.target.value)}
                      >
                        {question.options.map((option) => (
                          <FormControlLabel
                            key={option._id}
                            value={option._id}
                            control={<Radio />}
                            label={option.text}
                          />
                        ))}
                      </RadioGroup>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={3}>
                <Box p={2}>
                  <Typography variant="h6">Question List</Typography>
                  <List component="nav">
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
  } else if (elem.mozRequestFullScreen) { // Firefox
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { // IE/Edge
    elem.msRequestFullscreen();
  }
};

const exitFullScreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { // Firefox
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { // IE/Edge
    document.msExitFullscreen();
  }
};

export default Test;