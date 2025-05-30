import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './router'; 
import Navbar from './components/Layout/Navbar'; 
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar /> 
        <AppRouter /> 
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;