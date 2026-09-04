import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api';

// POST /api/chat
export const sendChatMessage = createAsyncThunk(
  'chat/sendChatMessage',
  async (message, { rejectWithValue }) => {
    try {
      const res = await apiClient.post('/chat', { message });
      return res.answer;
    } catch (err) {
      return rejectWithValue(err.message || 'Chat request failed');
    }
  }
);

// POST /api/ai/ask or POST /api/chat
export const askAI = createAsyncThunk(
  'chat/askAI',
  async (prompt, { rejectWithValue }) => {
    try {
      const res = await apiClient.post('/chat', { message: prompt });
      return res.answer;
    } catch (err) {
      return rejectWithValue(err.message || 'AI request failed');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    isOpen: false,
    loading: false,
    messages: [],
    error: null,
  },
  reducers: {
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    openChat: (state) => {
      state.isOpen = true;
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    addUserMessage: (state, action) => {
      state.messages.push({
        id: `usr_${Date.now()}`,
        sender: 'user',
        text: action.payload,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Chat
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: action.payload,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.messages.push({
          id: `err_${Date.now()}`,
          sender: 'bot',
          text: `Error: ${action.payload || 'Failed to connect to backend intelligence service.'}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        });
      })
      // Ask AI
      .addCase(askAI.pending, (state) => {
        state.loading = true;
      })
      .addCase(askAI.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          id: `ai_${Date.now()}`,
          sender: 'bot',
          text: action.payload,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      })
      .addCase(askAI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleChat, openChat, closeChat, addUserMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
