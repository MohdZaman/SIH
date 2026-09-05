import React from 'react';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import store from './app/store';
import AppRoutes from './routes';
import './App.css';

export default function App() {
  return (
    <Provider store={store}>
      <Toaster position="top-right" richColors closeButton />
      <AppRoutes />
    </Provider>
  );
}