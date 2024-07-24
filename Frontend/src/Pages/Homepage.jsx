import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, CircularProgress, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { useFetchAllSubjectsMutation } from '../Slices/userApiSlice';

const Homepage = () => {
  const navigate = useNavigate();
  const userInfo = useSelector( state => state.auth.userInfo );
  const [ subjects , setSubjects ] = useState(null);
  const [ fetchAllSubjects ] = useFetchAllSubjectsMutation();
  const [ loading , setLoading ] = useState(true);
  useEffect(() => {
    if ( !userInfo ) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetchAllSubjects().unwrap();
        setSubjects(Array.from( new Set(response.map(test => test.subject))));
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [ fetchAllSubjects ]);
  const handleSelectedSubject = (subject)=>{
    navigate(`/test/${subject}`);
  }
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
                onClick={() => handleSelectedSubject(subject)
                  }
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