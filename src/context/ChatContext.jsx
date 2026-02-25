import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const ChatContext = createContext(null);
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const normalizeSocketUrl = (value) => value.replace(/\/api\/?$/, '');

export function ChatProvider({ children }) {
  const { token, user } = useAuth();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [lastSeen, setLastSeen] = useState({});
  const [connectionError, setConnectionError] = useState('');

  useEffect(() => {
    if (!token || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
      setOnlineUsers(new Set());
      return;
    }

    const socket = io(normalizeSocketUrl(SOCKET_URL), {
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socketRef.current = socket;

    const handleConnect = () => {
      setIsConnected(true);
      setConnectionError('');
      socket.emit('presence:query');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleConnectError = (err) => {
      setIsConnected(false);
      setConnectionError(err?.message || 'Socket connection failed');
    };

    const handlePresenceList = ({ users }) => {
      setOnlineUsers(new Set(users || []));
    };

    const handlePresenceUpdate = ({ userId, status, lastSeen: seenAt }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (status === 'online') {
          next.add(userId);
        } else {
          next.delete(userId);
        }
        return next;
      });

      if (status === 'offline' && seenAt) {
        setLastSeen((prev) => ({ ...prev, [userId]: seenAt }));
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('presence:list', handlePresenceList);
    socket.on('presence:update', handlePresenceUpdate);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('presence:list', handlePresenceList);
      socket.off('presence:update', handlePresenceUpdate);
      socket.disconnect();
    };
  }, [token, user]);

  const value = useMemo(
    () => ({
      socket: socketRef.current,
      isConnected,
      connectionError,
      onlineUsers,
      lastSeen,
      setActiveConversation: (conversationId) => {
        socketRef.current?.emit('conversation:active', { conversationId });
      },
      clearActiveConversation: (conversationId) => {
        socketRef.current?.emit('conversation:inactive', { conversationId });
      },
      emitTypingStart: (toUserId, conversationId) => {
        socketRef.current?.emit('typing:start', { toUserId, conversationId });
      },
      emitTypingStop: (toUserId, conversationId) => {
        socketRef.current?.emit('typing:stop', { toUserId, conversationId });
      },
    }),
    [isConnected, connectionError, onlineUsers, lastSeen]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}

export default ChatContext;
