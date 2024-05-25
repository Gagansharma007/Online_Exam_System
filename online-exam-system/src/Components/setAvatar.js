// AvatarSettingPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AvatarSettingPage = () => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const handleAvatarUpload = async () => {
    const formData = new FormData();
    formData.append('avatar', avatar);
    
    try {
      const response = await axios.post('/api/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const avatarUrl = response.data.avatarUrl;
      // Update user profile with avatarUrl
      // Example: Update profile API call
      // axios.post('/api/update-profile', { avatarUrl });
      
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
