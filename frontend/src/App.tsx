import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation/Navigation';
import { Register } from './components/Register/Register';
import { Login } from './components/Login/Login';
import { Dashboard } from './components/Dashboard/Dashboard';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { MainPage } from './components/MainPage/MainPage';
import { NotFoundPage } from './components/NotFoundPage/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navigation />
          <Routes>
            {/* Vieši puslapiai */}
            <Route path="/" element={<MainPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Apsaugoti puslapiai */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
