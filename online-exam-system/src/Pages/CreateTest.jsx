import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  Paper,
  IconButton,
  Radio,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { createTest } from '../Utils/APIRoutes';

const CreateTest = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [questions, setQuestions] = useState([{ text: '', options: ['', '', '', ''], correctIndex: null }]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctIndex: null }]);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = questions.map((q, qi) =>
      qi === qIndex ? { ...q, options: q.options.map((o, oi) => (oi === oIndex ? value : o)) } : q
    );
    setQuestions(updatedQuestions);
  };

  const handleCorrectOptionChange = (qIndex, oIndex) => {
    const updatedQuestions = questions.map((q, qi) =>
      qi === qIndex ? { ...q, correctIndex: oIndex } : q
    );
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(createTest, {
        title,
        subject,
        timeLimit,
        questions,
      });
      console.log(response);
      navigate('/success');
    } catch (error) {
      console.error('Error creating test:', error);
    }
  };

  const isValidForm = title && subject && timeLimit && questions.every(isValidQuestion);

  function isValidQuestion(question) {
    return (
      question.text &&
      question.options.every((option) => option.trim().length > 0) &&
      question.options.length === 4 &&
      question.correctIndex !== null
    );
  }

  return (
    <Container>
      <Typography variant="h4">Create a New Test</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Test Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Subject"
          fullWidth
          margin="normal"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <TextField
          label="Time Limit (minutes)"
          fullWidth
          margin="normal"
          type="number"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddQuestion} startIcon={<AddIcon />}>
          Add Question
        </Button>
        {questions.map((question, qIndex) => (
          <Paper key={qIndex} style={{ marginTop: '16px', padding: '16px' }}>
            <TextField
              label={`Question ${qIndex + 1}`}
              fullWidth
              margin="normal"
              value={question.text}
              onChange={(e) => {
                const updatedQuestions = questions.map((q, qi) =>
                  qi === qIndex ? { ...q, text: e.target.value } : q
                );
                setQuestions(updatedQuestions);
              }}
            />
            <FormGroup>
              {question.options.map((option, oIndex) => (
                <Grid container alignItems="center" spacing={1} key={oIndex}>
                  <Grid item>
                    <TextField
                      label={`Option ${oIndex + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    />
                  </Grid>
                  <Grid item>
                    <Radio
                      checked={question.correctIndex === oIndex}
                      onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                    />
                  </Grid>
                </Grid>
              ))}
            </FormGroup>
          </Paper>
        ))}
        <Button type="submit" variant="contained" color="primary" style={{ marginLeft: '20px' }} disabled={!isValidForm}>
          Create Test
        </Button>
      </form>
    </Container>
  );
};

export default CreateTest;