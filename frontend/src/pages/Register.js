import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    telephone: '',
    ville: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        // Connexion automatique après inscription
        const loginRes = await fetch('http://127.0.0.1:8000/api/users/login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: formData.username, password: formData.password }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          localStorage.setItem('access_token', loginData.access);
          localStorage.setItem('refresh_token', loginData.refresh);
          localStorage.setItem('user_role', formData.role);
          localStorage.setItem('username', formData.username);
          window.location.href = '/';
        }
      } else {
        setError(JSON.stringify(data));
      }
    } catch (error) {
      setError('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '460px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🛒</div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1C1917' }}>Créer un compte</h1>
          <p style={{ color: '#78716C', fontSize: '14px', marginTop: '4px' }}>Rejoignez Mini Marketplace</p>
        </div>

        {/* Étape 1 — Choix du rôle */}
        {step === 1 && (
          <div>
            <p style={{ textAlign: 'center', fontWeight: '600', color: '#1C1917', marginBottom: '20px', fontSize: '16px' }}>
              Vous êtes ?
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                onClick={() => handleRoleSelect('acheteur')}
                style={{ flex: 1, padding: '24px 16px', backgroundColor: 'white', border: '2px solid #E7E5E4', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#F97316'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#E7E5E4'}
              >
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>🛍️</div>
                <div style={{ fontWeight: 'bold', color: '#1C1917', fontSize: '16px' }}>Acheteur</div>
                <div style={{ color: '#78716C', fontSize: '13px', marginTop: '4px' }}>Je cherche des produits</div>
              </button>
              <button
                onClick={() => handleRoleSelect('vendeur')}
                style={{ flex: 1, padding: '24px 16px', backgroundColor: 'white', border: '2px solid #E7E5E4', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#F97316'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#E7E5E4'}
              >
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>🏪</div>
                <div style={{ fontWeight: 'bold', color: '#1C1917', fontSize: '16px' }}>Vendeur</div>
                <div style={{ color: '#78716C', fontSize: '13px', marginTop: '4px' }}>Je veux vendre</div>
              </button>
            </div>
            <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#78716C' }}>
              Déjà un compte ?{' '}
              <Link to="/login" style={{ color: '#F97316', fontWeight: '600', textDecoration: 'none' }}>
                Se connecter
              </Link>
            </p>
          </div>
        )}

        {/* Étape 2 — Formulaire */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '12px', backgroundColor: '#FFF7ED', borderRadius: '8px' }}>
              <span style={{ fontSize: '24px' }}>{formData.role === 'vendeur' ? '🏪' : '🛍️'}</span>
              <span style={{ fontWeight: '600', color: '#F97316' }}>
                Inscription en tant que {formData.role}
              </span>
              <button
                onClick={() => setStep(1)}
                style={{ marginLeft: 'auto', backgroundColor: 'transparent', border: 'none', color: '#78716C', cursor: 'pointer', fontSize: '13px' }}
              >
                Changer
              </button>
            </div>

            {error && (
              <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1C1917', marginBottom: '6px' }}>Nom d'utilisateur</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange}
                  placeholder="Choisissez un nom d'utilisateur"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #E7E5E4', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} required />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1C1917', marginBottom: '6px' }}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="Votre adresse email"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #E7E5E4', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} required />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1C1917', marginBottom: '6px' }}>Mot de passe</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange}
                  placeholder="Choisissez un mot de passe"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #E7E5E4', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} required />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1C1917', marginBottom: '6px' }}>Téléphone</label>
                <input type="text" name="telephone" value={formData.telephone} onChange={handleChange}
                  placeholder="Votre numéro de téléphone"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #E7E5E4', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1C1917', marginBottom: '6px' }}>Ville</label>
                <input type="text" name="ville" value={formData.ville} onChange={handleChange}
                  placeholder="Votre ville"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #E7E5E4', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '14px', backgroundColor: loading ? '#FDBA74' : '#F97316', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Inscription...' : "S'inscrire"}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#78716C' }}>
              Déjà un compte ?{' '}
              <Link to="/login" style={{ color: '#F97316', fontWeight: '600', textDecoration: 'none' }}>
                Se connecter
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;