import { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import userService from '../services/userService';

const AuthContext = createContext(null);

const ACTIONS = {
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
};

const initialState = {
  user: null,
  token: localStorage.getItem('skillswap_token') || null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTIONS.LOGOUT:
      return { ...initialState, token: null, isLoading: false };
    case ACTIONS.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('skillswap_token');
      const storedUser = localStorage.getItem('skillswap_user');
      if (token && storedUser) {
        await delay(500);
        dispatch({
          type: ACTIONS.SET_USER,
          payload: { user: JSON.parse(storedUser), token },
        });
      } else {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await authService.login({ email, password });
      const { user, token } = res.data.data;

      localStorage.setItem('skillswap_token', token);
      localStorage.setItem('skillswap_user', JSON.stringify(user));

      dispatch({ type: ACTIONS.SET_USER, payload: { user, token } });
      toast.success(`Welcome back, ${user.name}!`);
      return user;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      throw new Error(error.message || 'Invalid email or password');
    }
  };

  const sendOtp = async (email) => {
    const res = await authService.sendOtp(email);
    return res.data;
  };

  const verifyOtp = async (email, otp) => {
    const res = await authService.verifyOtp(email, otp);
    return res.data;
  };

  const forgotPassword = async (email) => {
    const res = await authService.forgotPassword(email);
    return res.data;
  };

  const resetPassword = async (data) => {
    const res = await authService.resetPassword(data);
    return res.data;
  };

  const register = async (userData) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await authService.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        otp: userData.otp,
      });

      const { user, token } = res.data.data;
      localStorage.setItem('skillswap_token', token);
      localStorage.setItem('skillswap_user', JSON.stringify(user));

      dispatch({ type: ACTIONS.SET_USER, payload: { user, token } });
      toast.success('Account created successfully!');
      return user;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('skillswap_token');
    localStorage.removeItem('skillswap_user');
    dispatch({ type: ACTIONS.LOGOUT });
    toast.success('Logged out successfully');
  };

  const applyUserUpdate = (updatedUser) => {
    localStorage.setItem('skillswap_user', JSON.stringify(updatedUser));
    dispatch({ type: ACTIONS.UPDATE_USER, payload: updatedUser });
  };

  const updateProfile = async (updates) => {
    try {
      const res = await userService.updateProfile(updates);
      const updatedUser = res.data.data.user;
      applyUserUpdate(updatedUser);
      toast.success('Profile updated!');
      return updatedUser;
    } catch (error) {
      throw new Error(error.message || 'Profile update failed');
    }
  };

  const value = {
    ...state,
    login,
    register,
    sendOtp,
    verifyOtp,
    forgotPassword,
    resetPassword,
    logout,
    updateProfile,
    applyUserUpdate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
