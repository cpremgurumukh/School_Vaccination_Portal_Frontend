import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login, AuthRequest, AuthResponse } from '../services/authService';
import { isAuthenticated } from '../components/ProtectedRoute';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!username || !password) {
        setError("Username and password are required.");
        setLoading(false);
        return;
    }

    try {
      const credentials: AuthRequest = { username, password };
      const response: AuthResponse = await login(credentials);

      if (response.success) {
        console.log('Login successful');
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', username);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
        } else {
        setError('Login failed. Please check your credentials.');
        }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed. An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh'
    }}>
      <div style={{ 
          width: '100%', 
          maxWidth: '400px', 
          padding: '30px', 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
      }}>
        <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
          Student Vaccination Portal
        </h1>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem', color: '#555' }}>
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          {error && <p className="error-message" style={{ textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
          <button 
            type="submit" 
            disabled={loading} 
            style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#007bff', textDecoration: 'none' }}>Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;