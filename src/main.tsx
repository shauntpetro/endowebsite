import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { SupabaseProvider } from './context/SupabaseContext';
import { AuthProvider } from './components/auth/AuthContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SupabaseProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </SupabaseProvider>
  </StrictMode>
);