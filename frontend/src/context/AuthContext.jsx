import { createContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth State
  const initializeAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    try {
      if (token && storedUser && storedUser !== "undefined" && storedUser !== "null") {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
      localStorage.clear(); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Login Logic - Updated for your specific flat response structure
  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      
      console.log("Backend Response Structure:", response.data);

      const data = response.data;

      // 1. Check if token exists in the response
      if (data && data.token) {
        // 2. Destructure: take 'token' out, put everything else (name, id, email) into userData
        const { token, ...userData } = data;

        // 3. Verify we actually got user info (not just a token)
        if (userData.email || userData._id) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          
          API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(userData);
          
          return { success: true, user: userData };
        } else {
          throw new Error("Token received, but user profile details are missing.");
        }
      } else {
        throw new Error("No token found in server response");
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Login failed";
      console.error("Login Error Details:", msg);
      throw error; 
    }
  };

 // Register Logic - Updated to pass role and adminSecret
const register = async (name, email, password, role, adminSecret) => {
  try {
    // CRITICAL: We now pass role and adminSecret in the body
    const response = await API.post('/auth/register', { 
      name, 
      email, 
      password, 
      role, 
      adminSecret 
    });
    
    const data = response.data;
    
    if (data && data.token) {
      const token = data.token;
      
      // Destructure to separate token from user profile data
      const { token: _, ...userData } = data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      return userData; // Return the user object so the UI knows it worked
    }
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};