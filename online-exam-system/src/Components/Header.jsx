import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { setAvatarRoute } from '../Utils/APIRoutes'; 

const Header = ({ userName }) => {
    const navigate = useNavigate();
    const [ userId , setUserId ] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isAvatarSet, setIsAvatarSet] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('online-exam-system'));
        if (user){
        if ( user.isAvatarImageSet && user.avatarImage) {
            setAvatarUrl(user.avatarImage);
            setIsAvatarSet(true);
        }
        setUserId(user._id);
    }
    }, []);

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('online-exam-system');
        navigate('/login');
    };

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('avatar', file);
        try {
            const response = await axios.post(`${setAvatarRoute}/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const newAvatarUrl = `data:image/png;base64,${response.data.image}`;
            setAvatarUrl(newAvatarUrl);
            setIsAvatarSet(true);

            const user = JSON.parse(localStorage.getItem('online-exam-system'));
            user.avatarImage = newAvatarUrl;
            user.isAvatarImageSet = true;
            localStorage.setItem('online-exam-system', JSON.stringify(user));

        } catch (error) {
            console.error('Error uploading avatar', error);
        }

        handleClose();
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={handleHomeClick}>
                    Online Exam System
                </Typography>
                <IconButton color="inherit" onClick={handleHomeClick}>
                    <HomeIcon />
                </IconButton>
                <IconButton color="inherit" onClick={handleAvatarClick}>
                    <Avatar alt="Profile Picture" src={isAvatarSet ? avatarUrl : undefined}>
                        {!isAvatarSet && <AccountCircleIcon />}
                    </Avatar>
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