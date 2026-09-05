import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import procurementReducer from '../features/procurement/procurementSlice';
import standardReducer from '../features/standards/standardSlice';
import chatReducer from '../features/chat/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    procurement: procurementReducer,
    standards: standardReducer,
    chat: chatReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;