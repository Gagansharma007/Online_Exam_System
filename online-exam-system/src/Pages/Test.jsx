import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import { getQuestionById, submitQuiz } from '../Utils/APIRoutes';

const Test = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
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

  const handleChange = (questionId, optionId) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: optionId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(submitQuiz, {
        testId: test._id,
        answers: Object.entries(answers).map(([questionId, optionId]) => ({ questionId, optionId }))
      });
      navigate(`/result/${test._id}`);
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Typography variant="h4">{test.title}</Typography>
      <Typography variant="h6">{test.subject}</Typography>
      <form onSubmit={handleSubmit}>
        {test.questions.map((question) => (
          <Paper key={question._id} style={{ padding: '16px', margin: '16px 0' }}>
            <Typography variant="h6">{question.text}</Typography>
            <RadioGroup
              name={question._id}
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
        <Button type="submit" variant="contained" color="primary">Submit</Button>
      </form>
    </Container>
  );
};

export default Test;
