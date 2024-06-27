import React, { useState } from 'react';
import {
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  Paper,
  Radio,
  FormGroup,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useCreateNewTestMutation } from '../Slices/userApiSlice';
const CreateTest = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [questions, setQuestions] = useState([{ text: '', options: ['', '', '', ''], correctIndex: null }]);
  const [ createNewTest ] = useCreateNewTestMutation();
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
      await createNewTest({
        title,
        subject,
        timeLimit,
        questions,
      }).unwrap();
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
      <Typography variant="h4" style={{marginTop: '30px'}}>Create a New Test</Typography>
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
        
        {questions.map((question, qIndex) => (
          <Paper key={qIndex} style={{ marginTop: '16px', padding: '16px' }}>
            <TextField
              label={`Question ${qIndex + 1}`}
              fullWidth
              margin="normal"
              multiline
              rows={3}
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
                      multiline
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
        <Grid container spacing={2}>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: '20px' }}
          onClick={handleAddQuestion}
          startIcon={<AddIcon />}
        >
          Add Question
        </Button>
      </Grid>
      <Grid item>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginLeft: '20px', marginBottom: '30px' }}
          disabled={!isValidForm} 
          onClick={handleSubmit}
        >
          Create Test
        </Button>
      </Grid>
    </Grid>

      </form>
    </Container>
  );
};

export default CreateTest;