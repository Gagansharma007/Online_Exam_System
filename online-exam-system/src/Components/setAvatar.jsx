import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext';

const AvatarSettingPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [avatar, setAvatar] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const handleAvatarUpload = async () => {
    const formData = new FormData();
    formData.append('avatar', avatar);
    
    try {
      const response = await axios.post(`/api/upload-avatar/${user._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1]}`
        }
      });
      
      const avatarUrl = response.data.avatarUrl;
      // Update user profile with avatarUrl
      setUser(prevUser => ({
        ...prevUser,
        avatarImage: response.data.avatarImage,
        isAvatarImageSet: true
      }));
      
      navigate('/homepage');
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleAvatarChange} />
      <button onClick={handleAvatarUpload}>Upload Avatar</button>
    </div>
  );
};

export default AvatarSettingPage;
