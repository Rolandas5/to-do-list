import { useContext, useState } from 'react';
import './register.css';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useContext(AuthContext);

  const validateForm = () => {
    setPasswordError('');

    if (password !== confirmPassword) {
      setPasswordError('Slaptazodziai nesutampa');
      return false;
    }

    if (password.length < 6) {
      setPasswordError('Slaptazodis yra per trumpas');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      await register(name, email, password);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <h2>Registracija</h2>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Vardas ir Pavardė</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            </div>
            {passwordError && <p className="field-error">{passwordError}</p>}
          </div>

          <button type="submit" className="register-button">
            Registruotis
          </button>
        </form>

        <div className="login-link">
          Ar jau turite paskyrą?{' '}
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Prisijunkite
          </NavLink>
        </div>
        <footer className="site-footer">© 2005</footer>
      </div>
    </div>
  );
};
