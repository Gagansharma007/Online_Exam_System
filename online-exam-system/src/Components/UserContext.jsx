import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { authMe } from '../Utils/APIRoutes';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (token) {
          const { data } = await axios.get(authMe, {
            headers: { Authorization: `Bearer ${token.split('=')[1]}` }
          });
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
