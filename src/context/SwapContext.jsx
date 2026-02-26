import { createContext, useContext, useReducer, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import swapService from '../services/swapService';

const SwapContext = createContext(null);

const ACTIONS = {
  SET_SWAPS: 'SET_SWAPS',
  ADD_SWAP: 'ADD_SWAP',
  UPDATE_SWAP: 'UPDATE_SWAP',
  REMOVE_SWAP: 'REMOVE_SWAP',
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
      if (state.swaps.some((s) => s._id === action.payload._id)) {
        return {
          ...state,
          swaps: state.swaps.map((s) =>
            s._id === action.payload._id ? { ...s, ...action.payload } : s
          ),
        };
      }
      return { ...state, swaps: [action.payload, ...state.swaps] };
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTIONS.REMOVE_SWAP:
      return { ...state, swaps: state.swaps.filter((s) => s._id !== action.payload) };
    default:
      return state;
  }
}

export function SwapProvider({ children }) {
  const [state, dispatch] = useReducer(swapReducer, initialState);
  const { user } = useAuth();

  const fetchSwaps = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await swapService.getMySwaps();
      dispatch({ type: ACTIONS.SET_SWAPS, payload: res.data.data.swaps || [] });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      toast.error(error.message || 'Unable to load swaps');
    }
  }, []);

  const createSwap = async (swapData) => {
    const payload = {
      receiverId: swapData.receiverId,
      skillOffered: swapData.skillOffered,
      skillRequested: swapData.skillRequested,
      scheduledDate: swapData.scheduledDate || null,
    };

    const res = await swapService.create(payload);
    const createdSwap = res.data.data.swap;
    dispatch({ type: ACTIONS.ADD_SWAP, payload: createdSwap });
    toast.success('Swap request sent!');
    return createdSwap;
  };

  const updateSwapStatus = async (swapId, status) => {
    const res = await swapService.updateStatus(swapId, status);
    const updatedSwap = res.data.data.swap;
    dispatch({ type: ACTIONS.UPDATE_SWAP, payload: updatedSwap });
    const msg = {
      accepted: 'Swap accepted!',
      rejected: 'Swap declined.',
      completed: 'Swap marked as completed!',
    };
    toast.success(msg[status] || 'Swap updated');
  };

  const addFeedback = async (swapId, feedback, rating) => {
    const res = await swapService.addFeedback(swapId, { feedback, rating });
    const updatedSwap = res.data.data.swap;
    dispatch({ type: ACTIONS.UPDATE_SWAP, payload: updatedSwap });
    toast.success('Feedback submitted!');
  };

  const deleteSwap = async (swapId) => {
    await swapService.delete(swapId);
    dispatch({ type: ACTIONS.REMOVE_SWAP, payload: swapId });
    toast.success('Swap request deleted');
  };

  const fetchSwapById = async (swapId) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await swapService.getById(swapId);
      const swap = res.data.data.swap;
      dispatch({ type: ACTIONS.UPDATE_SWAP, payload: swap });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return swap;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      toast.error(error.message || 'Unable to load swap');
      return null;
    }
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
    deleteSwap,
    fetchSwapById,
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
