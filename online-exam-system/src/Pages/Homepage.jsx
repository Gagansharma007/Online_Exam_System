import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Grid, Typography } from '@mui/material';
import Header from "../Components/Header";
// import Footer from "../Components/Footer";
import TestCard from "../Components/TestCard";
const Homepage = () => {
    const navigate = useNavigate();
    const [ currentUser , setCurrentUser ] = useState(undefined);
    const [ isLoaded, setIsLoaded] = useState(false);
    useEffect(()=>{
        const funct = async () => {
        if(!localStorage.getItem('online-exam-system')){
          navigate('/login');
        } else {
          const user = await JSON.parse(localStorage.getItem('online-exam-system'));
          setCurrentUser(user);
          setIsLoaded(true);
        }
      }
        funct();
      },[navigate]);
      
    const tests = [
      { subjectName: 'Math', description: 'Test your mathematical skills with this challenging test.' },
      { subjectName: 'Science', description: 'Assess your knowledge in various scientific fields.' },
      { subjectName: 'History', description: 'Test your understanding of historical events and figures.' },
    ];

  return (
    
    <Box>
      { isLoaded && 
      <Header 
      userName={currentUser.username} />
      }

      <Container sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Select the test you want to take
        </Typography>

        <Grid container spacing={3}>
          {tests.map((test, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <TestCard subjectName={test.subjectName} description={test.description} />
            </Grid>

          ))}

        </Grid>
      </Container>

      {/* <Footer /> */}
    </Box> 
  
  )
}

export default Homepage;