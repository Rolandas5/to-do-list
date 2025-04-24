import { useContext, useState } from 'react';
import '../Register/register.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await login(email, password);
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <h2>Prisijungimas</h2>

        <form onSubmit={handleSubmit} className="register-form">
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

          <button type="submit" className="register-button">
            {'Prisijungti'}
          </button>
        </form>

        <div className="login-link">
          Neturite paskyros? <Link to="/register">Registruokites</Link>
        </div>
      </div>
    </div>
  );
};
