import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const ProtectedRoute = () => {
  // 1. issitraukiam is context'o reikalingas reiksmes
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  if (isAuthenticated) {
    // Outlet - reiskia, kad bus rodomi children toliau (pateks i reikalinga route nes yra autentifikuotas)
    return <Outlet />;
  } else {
    // Jeigu neautentifikuotas, nuredirectinam i /login forma
    navigate('/login');
    return null;
  }
};
