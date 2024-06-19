import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, CircularProgress, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { getAllTests } from '../Utils/APIRoutes';

const Homepage = () => {
  const navigate = useNavigate();
  const userInfo = useSelector( state => state.auth.userInfo );
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ( !userInfo ) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(getAllTests);
        const uniqueSubjects = Array.from(new Set(response.data.map(test => test.subject)));
        setSubjects(uniqueSubjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading ) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Container>
        <Typography variant="h4" sx={{textAlign: 'center', margin: '20px'}}>Subjects</Typography>
        <Grid container spacing={3}>
          {subjects.map((subject) => (
            <Grid item xs={12} sm={6} md={4} key={subject}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => navigate(`/test/${subject}`)}
              >
                {subject}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Homepage;