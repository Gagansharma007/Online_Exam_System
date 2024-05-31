import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, Grid, CircularProgress, Button } from '@mui/material';
import Header from "../Components/Header";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authMe, getAllTests } from "../Utils/APIRoutes";

const Homepage = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = document.cookie.split('; ').find(row => row.startsWith('token='));
                if (!token) {
                    navigate('/login');
                } else {
                    const { data } = await axios.get(authMe, {
                        headers: { Authorization: `Bearer ${token.split('=')[1]}` }
                    });
                    setCurrentUser(data.user);
                    setIsLoaded(true);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error("An error occurred. Please try again later.");
            }
        };

        fetchUserData();
    }, [navigate]);

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

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box>
            {isLoaded && <Header userName={currentUser.username} />}
            <Container>
                <Typography variant="h4">Subjects</Typography>
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
}

export default Homepage;
