import { useContext } from 'react';
import './App.css';
import BarLoading from './Components/Loading/BarLoading';
import AppProviders from './contextStore/AppProviders';
import ContextAuth, { AuthContext } from './contextStore/AuthContext';
import MainRoutes from './Routes/MainRoutes';

function AppContent() {
  const { authLoading } = useContext(AuthContext);
  if (authLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <BarLoading />
      </div>
    );
  }
  return (
    <AppProviders>
      <MainRoutes />
    </AppProviders>
  );
}

function App() {
  return (
    <ContextAuth>
      <AppContent />
    </ContextAuth>
  );
}

export default App;
