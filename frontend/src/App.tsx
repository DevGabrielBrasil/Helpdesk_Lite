// 1. TODOS OS IMPORTS DEVEM FICAR AQUI NO TOPO
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { useContext } from 'react';
import { Login } from './pages/Login';
import { Register } from './pages/Register'; // <-- O import deve estar aqui!
import { Dashboard } from './pages/Dashboard';
import TicketDetail from './pages/TicketDetail';

// 2. DEPOIS DOS IMPORTS, VÊM AS FUNÇÕES AUXILIARES
function PrivateRoute({ children }: { children: JSX.Element }) {
  const { signed } = useContext(AuthContext);
  return signed ? children : <Navigate to="/" />;
}

// 3. POR FIM, A FUNÇÃO PRINCIPAL
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route
            path="/tickets/:id"
            element={
              <PrivateRoute>
                <TicketDetail />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}