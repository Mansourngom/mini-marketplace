import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        const profileRes = await fetch('http://127.0.0.1:8000/api/users/profile/', {
          headers: { 'Authorization': `Bearer ${data.access}` }
        });
        const profile = await profileRes.json();
        localStorage.setItem('user_role', profile.role);
        localStorage.setItem('username', profile.username);
        window.location.href = '/';
      } else {
        setError('Identifiants incorrects. Veuillez réessayer.');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🛒</div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1C1917' }}>Connexion</h1>
          <p style={{ color: '#78716C', fontSize: '14px', marginTop: '4px' }}>Bienvenue sur Mini Marketplace</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1C1917', marginBottom: '6px' }}>
              Nom d'utilisateur
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Entrez votre nom d'utilisateur"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #E7E5E4', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              required
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1C1917', marginBottom: '6px' }}>
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Entrez votre mot de passe"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #E7E5E4', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '14px', backgroundColor: loading ? '#FDBA74' : '#F97316', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#78716C' }}>
          Pas encore de compte ?{' '}
          <Link to="/register" style={{ color: '#F97316', fontWeight: '600', textDecoration: 'none' }}>
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;