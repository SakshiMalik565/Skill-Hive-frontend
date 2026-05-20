import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiSend, FiSearch, FiPlus, FiCheck, FiCheckCircle, FiMessageSquare, FiX, FiPaperclip } from 'react-icons/fi';
import AnimatedPage from '../components/AnimatedPage';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import chatService from '../services/chatService';
import toast from 'react-hot-toast';
import './Inbox.css';

const formatTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatLastSeen = (value) => {
  if (!value) return 'Offline';
  const date = new Date(value);
  return `Last seen ${date.toLocaleString()}`;
};

const getInitials = (value) => {
  if (!value) return 'U';
  const parts = value.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
};

export default function Inbox() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    socket,
    isConnected,
    connectionError,
    onlineUsers,
    lastSeen,
    setActiveConversation,
    clearActiveConversation,
    emitTypingStart,
    emitTypingStop,
  } = useChat();

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [typingByConversation, setTypingByConversation] = useState({});
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const fileInputRef = useRef(null);

  const typingTimeoutRef = useRef(null);
  const typingClearTimers = useRef({});

  const activeConversation = useMemo(
    () => conversations.find((conv) => conv._id === activeConversationId) || null,
    [conversations, activeConversationId]
  );

  const canSend = useMemo(
    () => Boolean(draft.trim()) && Boolean(activeConversation) && !isSending,
    [draft, activeConversation, isSending]
  );

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setIsLoading(true);
        const res = await chatService.getConversations();
        setConversations(res.data.data.conversations || []);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, []);

  useEffect(() => {
    if (!activeConversationId) return;

    const loadMessages = async () => {
      const res = await chatService.getMessages(activeConversationId);
      const loadedMessages = res.data.data.messages || [];
      setMessages(
        loadedMessages.map((msg) =>
          msg.receiver === user?._id ? { ...msg, status: 'read' } : msg
        )
      );
    };

    loadMessages();
    setActiveConversation(activeConversationId);
    socket?.emit('messages:read', { conversationId: activeConversationId });

    return () => {
      clearActiveConversation(activeConversationId);
    };
  }, [activeConversationId, setActiveConversation, clearActiveConversation, socket, user]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === message.conversation
            ? {
              ...conv,
              lastMessage: message,
              unreadCount: conv._id === activeConversationId ? 0 : (conv.unreadCount || 0) + 1,
            }
            : conv
        )
      );

      if (message.conversation === activeConversationId) {
        setMessages((prev) => [...prev, message]);
        socket.emit('messages:read', { conversationId: activeConversationId });
      }
    };

    const handleMessageSent = (message) => {
      setMessages((prev) => [...prev, message]);
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === message.conversation
            ? { ...conv, lastMessage: message }
            : conv
        )
      );
      setIsSending(false);
    };

    const handleMessageDelivered = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, status: 'delivered' } : msg))
      );
    };

    const handleMessageRead = ({ conversationId, messageId }) => {
      if (messageId) {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === messageId ? { ...msg, status: 'read' } : msg))
        );
      } else if (conversationId && conversationId === activeConversationId) {
        setMessages((prev) =>
          prev.map((msg) => ({ ...msg, status: 'read' }))
        );
      }

      if (conversationId) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === conversationId
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );
      }
    };

    const handleReaction = ({ messageId, reactions }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, reactions } : msg))
      );
    };

    const handleTypingStart = ({ fromUserId, conversationId }) => {
      if (fromUserId === user?._id) return;
      setTypingByConversation((prev) => ({ ...prev, [conversationId]: true }));
      if (typingClearTimers.current[conversationId]) {
        clearTimeout(typingClearTimers.current[conversationId]);
      }
      typingClearTimers.current[conversationId] = setTimeout(() => {
        setTypingByConversation((prev) => ({ ...prev, [conversationId]: false }));
      }, 2000);
    };

    const handleTypingStop = ({ fromUserId, conversationId }) => {
      if (fromUserId === user?._id) return;
      setTypingByConversation((prev) => ({ ...prev, [conversationId]: false }));
    };

    socket.on('message:new', handleNewMessage);
    socket.on('message:sent', handleMessageSent);
    socket.on('message:delivered', handleMessageDelivered);
    socket.on('message:read', handleMessageRead);
    socket.on('message:reaction', handleReaction);
    socket.on('typing:start', handleTypingStart);
    socket.on('typing:stop', handleTypingStop);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('message:sent', handleMessageSent);
      socket.off('message:delivered', handleMessageDelivered);
      socket.off('message:read', handleMessageRead);
      socket.off('message:reaction', handleReaction);
      socket.off('typing:start', handleTypingStart);
      socket.off('typing:stop', handleTypingStop);
    };
  }, [socket, activeConversationId, user]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      Object.values(typingClearTimers.current).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const filteredConversations = useMemo(() => {
    if (!searchTerm.trim()) return conversations;
    return conversations.filter((conv) =>
      conv.participant?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conversations, searchTerm]);

  const handleConversationSelect = (conversationId) => {
    setActiveConversationId(conversationId);
    setConversations((prev) =>
      prev.map((conv) =>
        conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  const handleSendMessage = async () => {
    if (!activeConversation) {
      toast.error('Select a conversation first');
      return;
    }
    if (!draft.trim()) return;
    if (!activeConversation.participant?._id) {
      toast.error('Recipient not found');
      return;
    }

    setIsSending(true);
    const trimmed = draft.trim();
    setDraft('');

    // Stop typing indicator when sending
    if (activeConversation?.participant?._id) {
      emitTypingStop(activeConversation.participant._id, activeConversation._id);
    }

    if (isConnected && socket) {
      socket.emit('message:send', {
        conversationId: activeConversation._id,
        toUserId: activeConversation.participant?._id,
        text: trimmed,
      });
      emitTypingStop(activeConversation.participant?._id, activeConversation._id);
      return;
    }

    try {
      const res = await chatService.createMessage(activeConversation._id, {
        text: trimmed,
        receiverId: activeConversation.participant?._id,
      });
      const message = res.data.data.message;
      setMessages((prev) => [...prev, message]);
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === message.conversation
            ? { ...conv, lastMessage: message }
            : conv
        )
      );
    } catch (error) {
      toast.error(error?.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleDraftChange = (event) => {
    const value = event.target.value;
    setDraft(value);

    if (!activeConversation || !activeConversation.participant?._id) return;
    emitTypingStart(activeConversation.participant._id, activeConversation._id);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      emitTypingStop(activeConversation.participant._id, activeConversation._id);
    }, 1200);
  };

  const handleCreateConversation = async () => {
    if (!recipientEmail.trim()) return;
    try {
      setIsCreating(true);
      const res = await chatService.createConversation({ recipientEmail: recipientEmail.trim() });
      const conversation = res.data.data.conversation;
      setConversations((prev) => [conversation, ...prev]);
      setRecipientEmail('');
      setActiveConversationId(conversation._id);
    } catch (error) {
      toast.error(error?.message || 'Unable to start a chat');
    } finally {
      setIsCreating(false);
    }
  };

  const handleReaction = (messageId, emoji) => {
    socket?.emit('message:react', { messageId, emoji });
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading inbox..." />;
  }

  return (
    <AnimatedPage>
      <section className="inbox-page">
        <div className="inbox-container">
          <aside className="inbox-sidebar">
            <div className="inbox-header">
              <div>
                <h1>Inbox</h1>
              </div>
              <div className="inbox-header-actions">
                <button
                  className={`inbox-icon-btn ${showSearch ? 'active' : ''}`}
                  onClick={() => { setShowSearch((p) => !p); setShowCreate(false); }}
                  title="Search conversations"
                >
                  {showSearch ? <FiX /> : <FiSearch />}
                </button>
                <button
                  className={`inbox-icon-btn ${showCreate ? 'active' : ''}`}
                  onClick={() => { setShowCreate((p) => !p); setShowSearch(false); }}
                  title="New conversation"
                >
                  {showCreate ? <FiX /> : <FiPlus />}
                </button>
              </div>
            </div>

            {showSearch && (
              <div className="inbox-inline-input">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  autoFocus
                />
              </div>
            )}

            {showCreate && (
              <div className="inbox-inline-input">
                <input
                  type="email"
                  placeholder="Enter email to start chat..."
                  value={recipientEmail}
                  onChange={(event) => setRecipientEmail(event.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateConversation()}
                  autoFocus
                />
                <Button
                  variant="teal"
                  size="sm"
                  icon={<FiPlus />}
                  onClick={handleCreateConversation}
                  loading={isCreating}
                >
                  Go
                </Button>
              </div>
            )}

            <div className="conversation-list">
              {filteredConversations.length === 0 ? (
                <div className="empty-conversations">
                  <FiMessageSquare />
                  <p>No conversations yet</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const participant = conversation.participant;
                  const isActive = conversation._id === activeConversationId;
                  const isOnline = onlineUsers.has(participant?._id);
                  const typing = typingByConversation[conversation._id];

                  return (
                    <button
                      key={conversation._id}
                      className={`conversation-card ${isActive ? 'active' : ''}`}
                      onClick={() => handleConversationSelect(conversation._id)}
                    >
                      <div className="conversation-avatar">
                        {participant?.profilePic ? (
                          <img src={participant.profilePic} alt={participant?.name || 'User'} />
                        ) : (
                          <span>{getInitials(participant?.name || participant?.email)}</span>
                        )}
                        <span className={`presence-dot ${isOnline ? 'online' : 'offline'}`} />
                      </div>
                      <div className="conversation-details">
                        <div className="conversation-top">
                          <span className="conversation-name">{participant?.name || participant?.email}</span>
                          <span className="conversation-time">
                            {formatTime(conversation.lastMessage?.createdAt || conversation.updatedAt)}
                          </span>
                        </div>
                        <div className="conversation-preview">
                          {typing ? 'Typing...' : conversation.lastMessage?.text || 'No messages yet'}
                        </div>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="unread-count">{conversation.unreadCount}</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <section className="inbox-chat">
            {!activeConversation ? (
              <div className="empty-chat">
                <FiMessageSquare />
                <h2>Select a conversation</h2>
                <p>Pick a conversation to start messaging.</p>
              </div>
            ) : (
              <>
                <header className="chat-header">
                  <div className="chat-header-user" onClick={() => navigate(`/profile/${activeConversation.participant?._id}`)} style={{ cursor: 'pointer' }}>
                    <div className="chat-header-avatar">
                      {activeConversation.participant?.profilePic ? (
                        <img src={activeConversation.participant.profilePic} alt={activeConversation.participant?.name || 'User'} />
                      ) : (
                        <span>{getInitials(activeConversation.participant?.name || activeConversation.participant?.email)}</span>
                      )}
                    </div>
                    <div>
                      <h2>{activeConversation.participant?.name || activeConversation.participant?.email}</h2>
                      <p>
                        {onlineUsers.has(activeConversation.participant?._id)
                          ? 'Online'
                          : formatLastSeen(lastSeen[activeConversation.participant?._id])}
                      </p>
                    </div>
                  </div>
                  <div className="chat-status">
                    <span className={`connection-pill ${isConnected ? 'online' : 'offline'}`}>
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                    {!isConnected && connectionError && (
                      <span className="connection-error">{connectionError}</span>
                    )}
                  </div>
                </header>

                <div className="chat-messages">
                  {messages.map((message) => {
                    const isMine = message.sender === user?._id || message.sender?._id === user?._id;
                    const senderProfile = isMine
                      ? user?.profilePic
                      : activeConversation?.participant?.profilePic;
                    const senderLabel = isMine
                      ? user?.name || user?.email
                      : activeConversation?.participant?.name || activeConversation?.participant?.email;
                    return (
                      <motion.div
                        key={message._id}
                        className={`message-row ${isMine ? 'mine' : 'theirs'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {!isMine && (
                          <div className="message-avatar">
                            {senderProfile ? (
                              <img src={senderProfile} alt={senderLabel || 'User'} />
                            ) : (
                              <span>{getInitials(senderLabel)}</span>
                            )}
                          </div>
                        )}
                        <div className={`message-bubble ${isMine ? 'mine' : 'theirs'}`}>
                          <div className="message-text">{message.text}</div>
                          {isMine && (
                            <div className="message-meta">
                              <span className={`message-status ${message.status}`}>
                                {message.status === 'read' ? <FiCheckCircle /> : <FiCheck />}
                              </span>
                            </div>
                          )}
                        </div>
                        {isMine && (
                          <div className="message-avatar">
                            {senderProfile ? (
                              <img src={senderProfile} alt={senderLabel || 'User'} />
                            ) : (
                              <span>{getInitials(senderLabel)}</span>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                  {typingByConversation[activeConversationId] && (
                    <div className="typing-indicator">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  )}
                </div>

                <div className="chat-input">
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        toast.success(`Selected: ${file.name} (file sending coming soon)`);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    className="chat-attach-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach file"
                  >
                    <FiPaperclip />
                  </button>
                  <input
                    type="text"
                    placeholder="Type your message"
                    value={draft}
                    onChange={handleDraftChange}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        if (canSend) {
                          handleSendMessage();
                        }
                      }
                    }}
                    disabled={!activeConversation}
                  />
                  <Button
                    variant="primary"
                    icon={<FiSend />}
                    onClick={handleSendMessage}
                    loading={isSending}
                    disabled={!canSend}
                  >
                    Send
                  </Button>
                </div>
              </>
            )}
          </section>
        </div>
      </section>
    </AnimatedPage>
  );
}
