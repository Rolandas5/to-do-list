import { useContext, useState } from 'react';
import './register.css';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { register } = useContext(AuthContext);

  const validateForm = () => {
    setPasswordError('');

    // Patikriname ar slaptazodziai sutampa
    if (password !== confirmPassword) {
      setPasswordError('Slaptazodziai nesutampa');
      return false;
    }

    // Tikriname ar slaptazodis yra bent 6 simboliu ilgio
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passwordError && <p className="field-error">{passwordError}</p>}
          </div>

          <button type="submit" className="register-button">
            {'Registruotis'}
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
      </div>
    </div>
  );
};
