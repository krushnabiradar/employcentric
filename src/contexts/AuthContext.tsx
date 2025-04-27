import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import io from "socket.io-client";
import axios from "axios";

// API base URL
const API_BASE_URL = "http://localhost:5000/api";

// Create socket.io instance
const socketInstance = io("http://localhost:5000", {
  autoConnect: false,
  withCredentials: true
});

export type UserRole = "superadmin" | "admin" | "hr" | "manager" | "employee";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  phone?: string;
  avatar?: string;
  tenant?: {
    id: string;
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  socket: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<any>(socketInstance);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize auth state from localStorage user data only
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Connect socket and authenticate
      socket.connect();
      socket.emit('authenticate', parsedUser.id);
      
      // Check if session is still valid with the server
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
    
    // Socket event listeners for notifications
    socket.on('leave-status-update', (data: any) => {
      toast({
        title: "Leave Request Update",
        description: data.message,
      });
    });
    
    socket.on('new-leave-request', (data: any) => {
      toast({
        title: "New Leave Request",
        description: data.message,
      });
    });
    
    return () => {
      socket.disconnect();
      socket.off('leave-status-update');
      socket.off('new-leave-request');
    };
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        withCredentials: true
      });
      
      if (response.status === 200) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        // Session expired or invalid
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      // If server is unavailable or session is invalid, logout for security
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`, 
        { email, password },
        { withCredentials: true }
      );
      
      const { user: userData } = response.data;
      
      // Save user to state and localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      // No need to store token in localStorage with session cookies
      
      // Connect socket and authenticate
      socket.connect();
      socket.emit('authenticate', userData.id);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });
      
      // Redirect to dashboard
      if (userData.role === 'superadmin') {
        navigate("/superadmin");
      } else if (userData.role === 'admin' || userData.role === 'hr' || userData.role === 'manager' || userData.role === 'employee') {
        navigate("/tenant/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      let errorMessage = "Invalid email or password";
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clean up even if API fails
      localStorage.removeItem("user");
      setUser(null);
      
      // Disconnect socket
      socket.disconnect();
      
      navigate("/login");
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        socket,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
