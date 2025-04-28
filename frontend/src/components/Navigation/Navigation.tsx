import { useContext } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './navigation.css';

export const Navigation = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // Gaukite dabartinę vietą

  return (
    <nav className="navigation">
      <div className="navigation-logo">
        <span className="nav-icon">📝</span>
        Užduotys <span className="nav-icon">👨‍💻</span>
      </div>
      <ul>
        {/* Tik jei nesame login puslapyje, rodom "Pagrindinis" */}
        {location.pathname !== '/login' && (
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Pagrindinis
            </NavLink>
          </li>
        )}

        {isAuthenticated ? (
          <>
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Dashboard
              </NavLink>
            </li>
            <button
              className="logout-button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Atsijungti
            </button>
            {user?.role === 'admin' && (
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Admin
                </NavLink>
              </li>
            )}
          </>
        ) : (
          location.pathname !== '/login' && ( // Paslėpimas, jei esame login puslapyje
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Prisijungti
              </NavLink>
            </li>
          )
        )}
      </ul>
    </nav>
  );
};
