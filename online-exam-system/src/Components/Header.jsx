import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Avatar, Menu, MenuItem, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { setAvatarRoute, authMe } from '../Utils/APIRoutes';

const Header = ({ userName }) => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isAvatarSet, setIsAvatarSet] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
                    setUserId(data.user._id);
                    if (data.user.isAvatarImageSet && data.user.avatarImage) {
                        setAvatarUrl(`data:image/png;base64,${data.user.avatarImage}`);
                        setIsAvatarSet(true);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Error fetching user data");
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleHomeClick = () => navigate('/');
    const handleLogoutClick = () => {
        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        navigate('/login');
    };
    const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('avatar', file);
        setLoading(true);
        try {
            const response = await axios.post(`${setAvatarRoute}/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1]}`
                },
            });

            const newAvatarUrl = `data:image/png;base64,${response.data.image}`;
            setAvatarUrl(newAvatarUrl);
            setIsAvatarSet(true);
        } catch (error) {
            console.error('Error uploading avatar', error);
            setError("Error uploading avatar");
        } finally {
            setLoading(false);
            handleClose();
        }
    };

    const handleCreateTest = () => navigate('/createtest');

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={handleHomeClick}>
                    Online Exam System
                </Typography>
                <IconButton color="inherit" onClick={handleHomeClick}>
                    <HomeIcon />
                </IconButton>
                <Button color="inherit" onClick={handleCreateTest}>
                    Create Test
                </Button>
                <IconButton color="inherit" onClick={handleAvatarClick}>
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        <Avatar alt="Profile Picture" src={isAvatarSet ? avatarUrl : undefined}>
                            {!isAvatarSet && <AccountCircleIcon />}
                        </Avatar>
                    )}
                    <Typography variant="body1" sx={{ ml: 1 }}>{userName}</Typography>
                </IconButton>
                <Button color="inherit" onClick={handleLogoutClick}>
                    Logout
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                    <MenuItem>
                        <label htmlFor="avatar-upload" style={{ cursor: 'pointer' }}>Set Avatar</label>
                        <input
                            type="file"
                            id="avatar-upload"
                            style={{ display: 'none' }}
                            onChange={handleAvatarChange}
                            accept="image/*"
                        />
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;