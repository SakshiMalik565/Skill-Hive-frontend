import API from './api';

const getConversations = () => API.get('/chats/conversations');
const getMessages = (conversationId) => API.get(`/chats/conversations/${conversationId}/messages`);
const createConversation = (payload) => API.post('/chats/conversations', payload);
const createMessage = (conversationId, payload) => API.post(`/chats/conversations/${conversationId}/messages`, payload);

export default {
  getConversations,
  getMessages,
  createConversation,
  createMessage,
};
