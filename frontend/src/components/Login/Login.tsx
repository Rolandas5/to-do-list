import { useContext, useState } from 'react';
import '../Register/register.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <h2>Prisijungimas</h2>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            </div>
          </div>

          <button type="submit" className="register-button">
            Prisijungti
          </button>
        </form>

        <div className="login-link">
          Neturite paskyros?{' '}
          <NavLink
            to="/register"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Registruokitės
          </NavLink>
        </div>
        <footer className="site-footer">© 2005</footer>
      </div>
    </div>
  );
};
