import { createContext, useContext, useReducer, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const SwapContext = createContext(null);

const ACTIONS = {
  SET_SWAPS: 'SET_SWAPS',
  ADD_SWAP: 'ADD_SWAP',
  UPDATE_SWAP: 'UPDATE_SWAP',
  SET_LOADING: 'SET_LOADING',
};

const initialState = {
  swaps: [],
  isLoading: false,
};

function swapReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_SWAPS:
      return { ...state, swaps: action.payload, isLoading: false };
    case ACTIONS.ADD_SWAP:
      return { ...state, swaps: [action.payload, ...state.swaps] };
    case ACTIONS.UPDATE_SWAP:
      return {
        ...state,
        swaps: state.swaps.map((s) =>
          s._id === action.payload._id ? { ...s, ...action.payload } : s
        ),
      };
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const generateMockSwaps = () => [
  {
    _id: 'swap1',
    requester: {
      _id: '1',
      name: 'Alex Rivera',
      profilePic: '',
      rating: 4.8,
    },
    receiver: {
      _id: '2',
      name: 'Maya Chen',
      profilePic: '',
      rating: 4.6,
    },
    skillOffered: 'React',
    skillRequested: 'UI/UX Design',
    status: 'pending',
    scheduledDate: '2026-03-01T10:00:00.000Z',
    feedback: '',
    rating: 0,
    createdAt: '2026-02-15T08:00:00.000Z',
    updatedAt: '2026-02-15T08:00:00.000Z',
  },
  {
    _id: 'swap2',
    requester: {
      _id: '2',
      name: 'Maya Chen',
      profilePic: '',
      rating: 4.6,
    },
    receiver: {
      _id: '1',
      name: 'Alex Rivera',
      profilePic: '',
      rating: 4.8,
    },
    skillOffered: 'Figma',
    skillRequested: 'JavaScript',
    status: 'accepted',
    scheduledDate: '2026-02-25T14:00:00.000Z',
    feedback: '',
    rating: 0,
    createdAt: '2026-02-10T12:00:00.000Z',
    updatedAt: '2026-02-12T09:00:00.000Z',
  },
  {
    _id: 'swap3',
    requester: {
      _id: '3',
      name: 'Jordan Lee',
      profilePic: '',
      rating: 4.9,
    },
    receiver: {
      _id: '1',
      name: 'Alex Rivera',
      profilePic: '',
      rating: 4.8,
    },
    skillOffered: 'Python',
    skillRequested: 'React',
    status: 'completed',
    scheduledDate: '2026-02-05T16:00:00.000Z',
    feedback: 'Great session! Learned so much about React hooks.',
    rating: 5,
    createdAt: '2026-01-28T10:00:00.000Z',
    updatedAt: '2026-02-06T18:00:00.000Z',
  },
  {
    _id: 'swap4',
    requester: {
      _id: '1',
      name: 'Alex Rivera',
      profilePic: '',
      rating: 4.8,
    },
    receiver: {
      _id: '5',
      name: 'Elena Gomez',
      profilePic: '',
      rating: 4.5,
    },
    skillOffered: 'Node.js',
    skillRequested: 'Flutter',
    status: 'pending',
    scheduledDate: '2026-03-10T11:00:00.000Z',
    feedback: '',
    rating: 0,
    createdAt: '2026-02-18T15:00:00.000Z',
    updatedAt: '2026-02-18T15:00:00.000Z',
  },
  {
    _id: 'swap5',
    requester: {
      _id: '4',
      name: 'Sam Patel',
      profilePic: '',
      rating: 4.7,
    },
    receiver: {
      _id: '3',
      name: 'Jordan Lee',
      profilePic: '',
      rating: 4.9,
    },
    skillOffered: 'AWS',
    skillRequested: 'Machine Learning',
    status: 'rejected',
    scheduledDate: null,
    feedback: '',
    rating: 0,
    createdAt: '2026-02-12T07:00:00.000Z',
    updatedAt: '2026-02-13T10:00:00.000Z',
  },
  {
    _id: 'swap6',
    requester: {
      _id: '5',
      name: 'Elena Gomez',
      profilePic: '',
      rating: 4.5,
    },
    receiver: {
      _id: '2',
      name: 'Maya Chen',
      profilePic: '',
      rating: 4.6,
    },
    skillOffered: 'Mobile Development',
    skillRequested: 'Photoshop',
    status: 'completed',
    scheduledDate: '2026-02-08T09:00:00.000Z',
    feedback: 'Maya is an amazing teacher. Learned Photoshop basics quickly!',
    rating: 4,
    createdAt: '2026-01-30T14:00:00.000Z',
    updatedAt: '2026-02-09T20:00:00.000Z',
  },
];

export function SwapProvider({ children }) {
  const [state, dispatch] = useReducer(swapReducer, initialState);
  const { user } = useAuth();

  const fetchSwaps = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    await delay(600);
    dispatch({ type: ACTIONS.SET_SWAPS, payload: generateMockSwaps() });
  }, []);

  const createSwap = async (swapData) => {
    await delay(700);
    const newSwap = {
      _id: `swap_${Date.now()}`,
      requester: {
        _id: user?._id || '1',
        name: user?.name || 'You',
        profilePic: '',
        rating: user?.rating || 0,
      },
      receiver: swapData.receiver,
      skillOffered: swapData.skillOffered,
      skillRequested: swapData.skillRequested,
      status: 'pending',
      scheduledDate: swapData.scheduledDate || null,
      feedback: '',
      rating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: ACTIONS.ADD_SWAP, payload: newSwap });
    toast.success('Swap request sent!');
    return newSwap;
  };

  const updateSwapStatus = async (swapId, status) => {
    await delay(500);
    dispatch({
      type: ACTIONS.UPDATE_SWAP,
      payload: { _id: swapId, status, updatedAt: new Date().toISOString() },
    });
    const msg = {
      accepted: 'Swap accepted!',
      rejected: 'Swap declined.',
      completed: 'Swap marked as completed!',
    };
    toast.success(msg[status] || 'Swap updated');
  };

  const addFeedback = async (swapId, feedback, rating) => {
    await delay(400);
    dispatch({
      type: ACTIONS.UPDATE_SWAP,
      payload: { _id: swapId, feedback, rating, updatedAt: new Date().toISOString() },
    });
    toast.success('Feedback submitted!');
  };

  const getSwapById = (id) => state.swaps.find((s) => s._id === id);

  const getUserSwaps = useCallback(
    (userId) => {
      const uid = userId || user?._id;
      return {
        incoming: state.swaps.filter((s) => s.receiver._id === uid),
        outgoing: state.swaps.filter((s) => s.requester._id === uid),
        completed: state.swaps.filter(
          (s) =>
            s.status === 'completed' &&
            (s.requester._id === uid || s.receiver._id === uid)
        ),
        all: state.swaps.filter(
          (s) => s.requester._id === uid || s.receiver._id === uid
        ),
      };
    },
    [state.swaps, user]
  );

  const value = {
    ...state,
    fetchSwaps,
    createSwap,
    updateSwapStatus,
    addFeedback,
    getSwapById,
    getUserSwaps,
  };

  return <SwapContext.Provider value={value}>{children}</SwapContext.Provider>;
}

export function useSwaps() {
  const ctx = useContext(SwapContext);
  if (!ctx) throw new Error('useSwaps must be used within SwapProvider');
  return ctx;
}

export default SwapContext;
