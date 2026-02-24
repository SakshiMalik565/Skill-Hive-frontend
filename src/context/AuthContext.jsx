import { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';
import authService from '../services/authService';

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

const MOCK_USERS = [
  {
    _id: '1',
    name: 'Alex Rivera',
    email: 'alex@demo.com',
    password: 'Demo@123',
    role: 'user',
    bio: 'Full-stack developer passionate about React and Node.js. Love teaching web technologies!',
    skillsOffered: ['React', 'Node.js', 'JavaScript', 'TypeScript'],
    skillsWanted: ['UI/UX Design', 'Figma', 'Graphic Design'],
    rating: 4.8,
    profilePic: '',
  },
  {
    _id: '2',
    name: 'Maya Chen',
    email: 'maya@demo.com',
    password: 'Demo@123',
    role: 'user',
    bio: 'Creative designer with 5 years of experience. Looking to expand into development.',
    skillsOffered: ['UI/UX Design', 'Figma', 'Photoshop', 'Illustration'],
    skillsWanted: ['React', 'JavaScript', 'Python'],
    rating: 4.6,
    profilePic: '',
  },
  {
    _id: '3',
    name: 'Jordan Lee',
    email: 'jordan@demo.com',
    password: 'Demo@123',
    role: 'user',
    bio: 'Data science enthusiast and Python expert. Teaching machine learning concepts.',
    skillsOffered: ['Python', 'Machine Learning', 'Data Science', 'SQL'],
    skillsWanted: ['React', 'Mobile Development', 'DevOps'],
    rating: 4.9,
    profilePic: '',
  },
  {
    _id: '4',
    name: 'Sam Patel',
    email: 'sam@demo.com',
    password: 'Demo@123',
    role: 'admin',
    bio: 'Platform admin and DevOps engineer. Building systems that scale.',
    skillsOffered: ['DevOps', 'Docker', 'AWS', 'CI/CD'],
    skillsWanted: ['Machine Learning', 'Rust', 'Blockchain'],
    rating: 4.7,
    profilePic: '',
  },
  {
    _id: '5',
    name: 'Elena Gomez',
    email: 'elena@demo.com',
    password: 'Demo@123',
    role: 'user',
    bio: 'Mobile developer and Flutter enthusiast. Always eager to learn new frameworks.',
    skillsOffered: ['Flutter', 'Dart', 'Mobile Development', 'Firebase'],
    skillsWanted: ['Node.js', 'GraphQL', 'System Design'],
    rating: 4.5,
    profilePic: '',
  },
];

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

  const updateProfile = async (updates) => {
    await delay(600);
    const updatedUser = { ...state.user, ...updates };
    localStorage.setItem('skillswap_user', JSON.stringify(updatedUser));
    dispatch({ type: ACTIONS.UPDATE_USER, payload: updates });
    toast.success('Profile updated!');
    return updatedUser;
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
    MOCK_USERS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
